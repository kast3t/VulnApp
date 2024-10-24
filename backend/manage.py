import datetime
import json
import os
import random
import requests as r
import string
from app import create_app, db
from articles.models import Article
from comments.models import Comment
from flask_migrate import upgrade, migrate, init, stamp
from users.models import User


def generate_random_string(size: int = 18, chars=string.ascii_uppercase + string.ascii_lowercase + string.digits):
    return "".join(random.choice(chars) for _ in range(size))


def get_random_datetime():
    int_delta = 7 * 24 * 60 * 60
    random_second = random.randrange(int_delta)

    return datetime.datetime.now() - datetime.timedelta(seconds=random_second)


def get_remote_top_password():
    url = ("https://raw.githubusercontent.com/danielmiessler/SecLists/refs/heads/master/"
           "Passwords/2023-200_most_used_passwords.txt")
    try:
        req = r.get(url)
        if req.status_code == r.codes.ok:
            passwords = req.content.decode("utf-8").splitlines()
            return random.choice(passwords)
        else:
            raise Exception(f"Content wasn't received. Error code: {req.status_code} - {req.reason}")
    except Exception as err:
        raise Exception(err)


def get_content_from_file(path: str):
    path = "/backend/entities" + path
    try:
        with open(path, "r") as file:
            return file.read()
    except Exception as err:
        raise Exception(err)


def deploy():
    """
    Инициализируем БД, мигрируя из ORM в БД PG. Файл manage.py необходимо запустить при первом запуске контейнера.
    В Docker-е зайти в контейнер "backend-1", вкладка "Exec", ввести команду: "python3.12 manage.py"
    """

    app = create_app(os.getenv("CONFIG_MODE"))
    app.app_context().push()
    db.drop_all()
    db.create_all()

    users_dict = json.loads(get_content_from_file("/txt/users.json"))
    users = []
    for user in users_dict:
        users.append(
            User(email=user["email"],
                 username=user["username"],
                 password=generate_random_string() if user["username"] != "student" else get_remote_top_password(),
                 is_admin=user["is_admin"])
        )
    db.session.add_all(users)
    db.session.commit()

    articles_dict = json.loads(get_content_from_file("/txt/articles.json"))
    articles = []
    for article in articles_dict:
        articles.append(
            Article(author_id=article["author_id"],
                    category=article["category"],
                    image=article["image"],
                    title=article["title"],
                    text=article["text"])
        )
    db.session.add_all(articles)
    db.session.commit()

    comments_str_list = get_content_from_file("/txt/comments.txt").splitlines()
    random.shuffle(comments_str_list)
    comments = []
    for article in articles:
        for _ in range(random.randrange(2, 6)):
            random_date = get_random_datetime()
            comments.append(
                Comment(author_id=random.randint(1, 4),
                        article_id=article.id,
                        text=comments_str_list[0],
                        created=random_date,
                        updated=random_date)
            )
            comments_str_list.pop(0)
    db.session.add_all(comments)
    db.session.commit()

    init()
    stamp()
    migrate()
    upgrade()


deploy()
