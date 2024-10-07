from account.authorization import Claims, claims_required
from app import app
from comments.controllers import create_comment_controller, update_comment_controller, delete_comment_controller
from flask import request
from flask_jwt_extended import jwt_required


@app.route("/api/articles/<uuid:article_id>/comment", methods=["POST"])
def create_comments(article_id):
    """
    Маршрут для создания комментария к статье article_id
    :return: JSON-ответ
    """
    return create_comment_controller(article_id)


@app.route("/api/admin/comments/<uuid:comment_id>", methods=["PUT", "DELETE"])
@jwt_required()
@claims_required(Claims.comments_update_delete)
def update_destroy_comments(comment_id):
    """
    Админские маршруты для редактирования и удаления комментария по GUID
    :return: JSON-ответ
    """
    if request.method == "PUT":
        return update_comment_controller(comment_id)
    if request.method == "DELETE":
        return delete_comment_controller(comment_id)
