from account.controllers import register_my_account_controller, login_my_account_controller, \
    retrieve_my_account_controller, update_my_account_controller, refresh_my_token_controller, \
    logout_my_account_controller
from app import app
from flask_jwt_extended import jwt_required


@app.route("/api/register", methods=["POST"])
def register_my_account():
    """
    Маршрут для регистрации аккаунта
    :return: JSON-ответ
    """
    return register_my_account_controller()


@app.route("/api/login", methods=["POST"])
def login_my_account():
    """
    Маршрут для аутентификации
    :return: JSON-ответ
    """
    return login_my_account_controller()


@app.route("/api/account", methods=["GET"])
@jwt_required()
def retrieve_my_account():
    """
    Маршрут для получения информации о своём аккаунте
    :return: JSON-ответ
    """
    return retrieve_my_account_controller()


@app.route("/api/account/update", methods=["GET"])
@jwt_required()
def update_my_account():
    """
    Маршрут для редактирования данных о своём аккаунте
    :return: JSON-ответ
    """
    return update_my_account_controller()


@app.route("/api/account/refresh-token", methods=["POST"])
@jwt_required(refresh=True)
def refresh_my_token():
    """
    Маршрут для обновления access токена
    :return: JSON-ответ
    """
    return refresh_my_token_controller()


@app.route("/api/logout", methods=["GET"])
@jwt_required()
def logout_my_account():
    """
    Маршрут для логаута
    :return: JSON-ответ
    """
    return logout_my_account_controller()
