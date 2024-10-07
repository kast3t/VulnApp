from account.authorization import Claims, claims_required
from app import app
from articles.controllers import list_all_articles_controller, retrieve_article_controller, create_article_controller, \
    update_article_controller, delete_article_controller
from flask import request
from flask_jwt_extended import jwt_required


@app.route("/api/articles", methods=["GET"])
def list_articles():
    """
    Маршрут для получения списка статей
    :return: JSON-ответ
    """
    return list_all_articles_controller()


@app.route("/api/articles/<uuid:article_id>", methods=["GET"])
def retrieve_articles(article_id):
    """
    Маршрут для получения статьи по GUID
    :return: JSON-ответ
    """
    return retrieve_article_controller(article_id)


@app.route("/api/admin/articles", methods=["POST"])
@jwt_required()
@claims_required(Claims.articles_create_update_delete)
def create_articles():
    """
    Админский маршрут для создания статьи
    :return: JSON-ответ
    """
    return create_article_controller()


@app.route("/api/admin/articles/<uuid:article_id>", methods=["PUT", "DELETE"])
@jwt_required()
def update_destroy_articles(article_id):
    """
    Админские маршруты для редактирования и удаления статьи по GUID
    :return: JSON-ответ
    """
    if request.method == "PUT":
        return update_article_controller(article_id)
    if request.method == "DELETE":
        return delete_article_controller(article_id)
