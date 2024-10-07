import re
from account.authorization import Roles
from app import db
from datetime import datetime
from error_handler import APIDataValidateError, APIConflictError
from sqlalchemy import DateTime, String, inspect
from sqlalchemy.orm import relationship, Mapped, mapped_column, validates
from typing import List


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    created: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now)
    updated: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)
    is_admin: Mapped[bool] = mapped_column(nullable=False, default=False)

    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    username: Mapped[str] = mapped_column(String(30), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(nullable=False)

    articles: Mapped[List["Article"]] = relationship(back_populates="author", cascade="save-update, merge, delete",
                                                     passive_deletes=True)
    comments: Mapped[List["Comment"]] = relationship(back_populates="author", cascade="save-update, merge, delete",
                                                     passive_deletes=True)

    def authenticate(self, password):
        return self.password == password

    @validates("email")
    def validate_email(self, key, email):
        if not email:
            raise APIDataValidateError("Email address not specified")
        if not re.match("[^@]+@[^@]+\.[^@]+", email):
            raise APIDataValidateError("Specified email is not an email address")
        if User.query.filter(User.email == email).first():
            raise APIConflictError("Email is already in use")
        return email

    @validates("username")
    def validate_username(self, key, username):
        if not username:
            raise APIDataValidateError("Username not specified")
        if len(username) < 5 or len(username) > 30:
            raise APIDataValidateError("Username must be between 5 and 30 characters")
        if User.query.filter(User.username == username).first():
            raise APIConflictError("Username is already in use")
        return username

    @validates("password")
    def validate_password(self, key, password):
        if not password:
            raise APIDataValidateError("Password not specified")
        return password

    @validates("is_admin")
    def validate_password(self, key, is_admin):
        if isinstance(is_admin, str) and (is_admin.lower() == "true" or is_admin == "1"):
            return True
        if isinstance(is_admin, str) and (is_admin.lower() == "false" or is_admin == "0"):
            return False
        return is_admin

    def to_dict(self):
        """
        Конвертируем сущность User в словарь, попутно удаляя пароль юзера из ответа по понятным причинам
        :return: Словарь
        """
        result = {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}
        del result["password"]
        return result

    def get_claims(self):
        """
        Получить список клеймов, основываясь на роли пользователя
        :return: Список клеймов
        """
        if self.is_admin:
            return Roles.admin
        else:
            return Roles.user

    def __repr__(self):
        return f"<User. id: {self.id}, username: {self.username}>"
