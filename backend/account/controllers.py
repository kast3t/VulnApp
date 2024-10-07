from app import db
from error_handler import APIUnauthorizedError, APINotFoundError
from flask import request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, set_access_cookies, set_refresh_cookies, \
    get_jwt_identity, unset_jwt_cookies
from sqlalchemy.sql import text
from users.models import User


def register_my_account_controller():
    request_data = request.get_json()

    new_user = User(email=request_data["email"],
                    username=request_data["username"],
                    password=request_data["password"])
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id, additional_claims={"claims": new_user.get_claims()})
    refresh_token = create_refresh_token(identity=new_user.id)

    response = jsonify(User.query.get(new_user.id).to_dict())
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)

    return response


def login_my_account_controller():
    request_data = request.get_json()

    query_str = f"SELECT * FROM users WHERE (email = '{request_data["email"]}')"
    query = text(query_str)
    user = db.session.query(User).from_statement(query).first()
    if not user:
        raise APINotFoundError("User not found")
    if not user.authenticate(request_data["password"]):
        raise APIUnauthorizedError("Email or password is incorrect")

    access_token = create_access_token(identity=user.id, additional_claims={"claims": user.get_claims()})
    refresh_token = create_refresh_token(identity=user.id)

    response = jsonify(User.query.get(user.id).to_dict())
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)

    return response


def retrieve_my_account_controller():
    user_id = get_jwt_identity()
    response = User.query.get(user_id).to_dict()

    return jsonify(response)


def update_my_account_controller():
    user_id = get_jwt_identity()
    request_args = request.args.to_dict()

    user = User.query.get(user_id)
    for key, value in request_args.items():
        setattr(user, key, value)
    db.session.commit()

    response = User.query.get(user_id).to_dict()
    return jsonify(response)


def refresh_my_token_controller():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    access_token = create_access_token(identity=user_id, additional_claims={"claims": user.get_claims()})

    response = jsonify({"msg": "Access token successfuly refreshed"})
    set_access_cookies(response, access_token)

    return response


def logout_my_account_controller():
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)

    return response
