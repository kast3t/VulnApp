from app import app
from flask import jsonify


class APIError(Exception):
    """
    Базовое исключение
    """
    code = 500
    name = "Unexpected error"


class APIDataValidateError(APIError):
    """
    Исключение, когда какое-либо из полученных полей не прошло валидацию (на пустоту, длину, регулярку)
    """
    code = 400
    name = "Data validation error"


class APIUnauthorizedError(APIError):
    """
    Исключение, когда пользователь не аутентифицирован
    """
    code = 401
    name = "Unauthorized"


class APIForbiddenError(APIError):
    """
    Исключение, когда пользователь не имеет прав
    """
    code = 403
    name = "Forbidden"


class APINotFoundError(APIError):
    """
    Исключение, когда какой-либо инстанс не был найден
    """
    code = 404
    name = "Not found"


class APIConflictError(APIError):
    """
    Исключение, когда какое-либо из полученных полей, которое должно быть уникальным, уже имеется в БД
    """
    code = 409
    name = "Conflict"


@app.errorhandler(Exception)
def handle_exception(err):
    if hasattr(err, "name"):
        errName = err.name
        errCode = err.code
    else:
        errName = err.__class__.__name__
        errCode = 500

    response = {"error": errName, "msg": ""}
    if len(err.args) > 0:
        response["msg"] = err.args[0]

    app.logger.error(f"{errName}: {response["msg"]}")
    return jsonify(response), errCode
