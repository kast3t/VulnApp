from app import db
from error_handler import APINotFoundError
from flask import request, jsonify
from users.models import User


def list_all_users_controller():
    response = []

    users = User.query.order_by(User.id).all()
    for user in users:
        response.append(user.to_dict())

    return jsonify(response)


def create_user_controller():
    request_data = request.get_json()

    new_user = User()
    for key, value in request_data.items():
        setattr(new_user, key, value)
    db.session.add(new_user)
    db.session.commit()

    response = User.query.get(new_user.id).to_dict()
    return jsonify(response)


def retrieve_user_controller(user_id):
    user = User.query.get(user_id)
    if not user:
        raise APINotFoundError("User not found")
    response = user.to_dict()
    return jsonify(response)


def update_user_controller(user_id):
    request_data = request.get_json()
    user = User.query.get(user_id)
    if not user:
        raise APINotFoundError("User not found")

    for key, value in request_data.items():
        setattr(user, key, value)
    db.session.commit()

    response = user.to_dict()
    return jsonify(response)


def delete_user_controller(user_id):
    user = User.query.filter_by(id=user_id).delete()
    db.session.commit()
    if not user:
        raise APINotFoundError("User not found")

    return jsonify({"msg": f"User <{user_id}> was deleted successfully"})
