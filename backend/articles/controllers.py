from app import db
from articles.models import Article
from error_handler import APINotFoundError
from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from sqlalchemy.sql import text


def list_all_articles_controller():
    response = []
    category = request.args.get("category")
    if category:
        query_str = f"SELECT * FROM articles WHERE category = '{category}' ORDER BY created DESC"
    else:
        query_str = f"SELECT * FROM articles ORDER BY created DESC"

    query = text(query_str)
    result = db.session.execute(query)
    articles = result.fetchall()

    for article in articles:
        response.append(article._asdict())

    return jsonify(response)


def retrieve_article_controller(article_id):
    article = Article.query.get(article_id)
    if not article:
        raise APINotFoundError("Article not found")
    response = article.to_dict(add_comments_info=True)

    return jsonify(response)


def create_article_controller():
    request_data = request.get_json()
    author_id = get_jwt_identity()

    new_article = Article()
    for key, value in request_data.items():
        setattr(new_article, key, value)
    new_article.author_id = author_id
    db.session.add(new_article)
    db.session.commit()

    response = Article.query.get(new_article.id).to_dict()
    return jsonify(response)


def update_article_controller(article_id):
    request_data = request.get_json()
    article = Article.query.get(article_id)
    if not article:
        raise APINotFoundError("Article not found")

    for key, value in request_data.items():
        setattr(article, key, value)
    db.session.commit()

    response = article.to_dict()
    return jsonify(response)


def delete_article_controller(article_id):
    article = Article.query.filter_by(id=article_id).delete()
    db.session.commit()
    if not article:
        raise APINotFoundError("Article not found")

    return jsonify({"msg": f"Article <{article_id}> was deleted successfully"})
