from app import db
from datetime import datetime
from error_handler import APIDataValidateError
from sqlalchemy import DateTime, ForeignKey, String, Text, inspect
from sqlalchemy.orm import relationship, Mapped, mapped_column, validates
from typing import List, Optional
from users.models import User
from uuid import UUID, uuid4


class Article(db.Model):
    __tablename__ = "articles"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    created: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now)
    updated: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)

    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String(250))
    image: Mapped[Optional[str]] = mapped_column(String(250))
    title: Mapped[str] = mapped_column(String(250), nullable=False)
    text: Mapped[Text] = mapped_column(Text, nullable=False)

    author: Mapped[User] = relationship(back_populates="articles")
    comments: Mapped[List["Comment"]] = relationship(back_populates="article", cascade="save-update, merge, delete",
                                                     passive_deletes=True)

    @validates("title")
    def validate_title(self, key, title):
        if not title:
            raise APIDataValidateError("Title not specified")
        return title

    @validates("text")
    def validate_text(self, key, text):
        if not text:
            raise APIDataValidateError("Text not specified")
        return text

    def to_dict(self, add_comments_info: bool = False):
        """
        Конвертируем сущность Article в словарь, при необходимости добавляем информацию о комментариях
        :param add_comments_info: True, если нужно добавить информацию о комментариях
        :return: Словарь
        """
        result = {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}
        result["author"] = self.author.username

        if add_comments_info:
            result["comments"] = [comment.to_dict() for comment in self.comments]

        return result

    def __repr__(self):
        return f"<Article. id: {self.id}, title: {self.title}, author: {self.author.username}>"
