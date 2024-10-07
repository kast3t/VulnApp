from account.authorization import Claims, claims_required
from app import app
from flask import request
from flask_jwt_extended import jwt_required
from users.controllers import list_all_users_controller, create_user_controller, retrieve_user_controller, \
                               update_user_controller, delete_user_controller


@app.route("/api/admin/users", methods=["POST"])
@jwt_required()
@claims_required(Claims.users_crud)
def create_accounts():
    """
    Админский маршрут для создания новых пользователей
    :return: JSON-ответ
    """
    return create_user_controller()


@app.route("/api/admin/users", methods=["GET"])
@jwt_required()
def list_accounts():
    """
    Админский маршрут для получения списка пользователей
    :return: JSON-ответ
    """
    return list_all_users_controller()


@app.route("/api/admin/users/<int:user_id>", methods=["GET", "PUT", "DELETE"])
@jwt_required()
@claims_required(Claims.users_crud)
def retrieve_update_destroy_accounts(user_id):
    """
    Админские маршруты для получения, редактирования и удаления пользователя
    :return: JSON-ответ
    """
    if request.method == "GET":
        return retrieve_user_controller(user_id)
    if request.method == "PUT":
        return update_user_controller(user_id)
    if request.method == "DELETE":
        return delete_user_controller(user_id)
