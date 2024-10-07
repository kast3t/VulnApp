from app import db
from comments.models import Comment
from error_handler import APINotFoundError
from flask import request, jsonify


def create_comment_controller(article_id):
    request_data = request.get_json()

    new_comment = Comment(author_id=request_data["author_id"],
                          article_id=article_id,
                          text=request_data["text"])
    db.session.add(new_comment)
    db.session.commit()

    response = Comment.query.get(new_comment.id).to_dict()
    return jsonify(response)


def update_comment_controller(comment_id):
    request_data = request.get_json()
    comment = Comment.query.get(comment_id)
    if not comment:
        raise APINotFoundError("Comment not found")

    for key, value in request_data.items():
        setattr(comment, key, value)
    db.session.commit()

    response = comment.to_dict(add_article_info=True)
    return jsonify(response)


def delete_comment_controller(comment_id):
    comment = Comment.query.filter_by(id=comment_id).delete()
    db.session.commit()
    if not comment:
        raise APINotFoundError("Comment not found")

    return jsonify({"msg": f"Comment <{comment_id}> was deleted successfully"})
