from error_handler import APIForbiddenError
from flask_jwt_extended import get_jwt
from functools import wraps


class Claims:
    """
    Класс клеймов (разрешений), которые затем выдаются ролям (сущность Roles)
    """

    articles_create_update_delete = "articles_create_update_delete"
    """
    Создание, редактирование и удаление любой статьи
    """

    comments_create = "comments_create"
    """
    Создание комментариев
    """

    comments_update_delete = "comments_update_delete"
    """
    Редактирование и удаление комментариев
    """

    users_crud = "users_crud"
    """
    Создание, чтение, редактирование и удаление любого пользователя
    """

    @staticmethod
    def get_all_claims():
        return [claim for claim in dir(Claims) if not claim.startswith("__") and not claim == "get_all_claims"]


class Roles:
    """
    Класс ролей, каждая роль представляет собой только список клеймов (строк)
    """
    user = [Claims.comments_create]
    admin = Claims.get_all_claims()


def claims_required(claims_req: str or list[str]):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            claims_of_user = get_jwt().get("claims")

            if isinstance(claims_req, str):
                claims_req_final = [claims_req]
            else:
                claims_req_final = claims_req

            missing_claims = list(set(claims_req_final).difference(claims_of_user))
            if not missing_claims:
                return fn(*args, **kwargs)
            else:
                raise APIForbiddenError(f"You don't have required claims: {', '.join(missing_claims)}")
        return decorator
    return wrapper
