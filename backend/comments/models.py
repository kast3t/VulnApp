from app import db
from articles.models import Article
from datetime import datetime
from error_handler import APIDataValidateError
from sqlalchemy import DateTime, ForeignKey, Text, inspect
from sqlalchemy.orm import relationship, Mapped, mapped_column, validates
from users.models import User
from uuid import UUID, uuid4


class Comment(db.Model):
    __tablename__ = "comments"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    created: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now)
    updated: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)

    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    article_id: Mapped[UUID] = mapped_column(ForeignKey("articles.id", ondelete="CASCADE"), nullable=False)
    text: Mapped[Text] = mapped_column(Text, nullable=False)

    author: Mapped[User] = relationship(back_populates="comments")
    article: Mapped[Article] = relationship(back_populates="comments")

    @validates("text")
    def validate_text(self, key, text):
        if not text:
            raise APIDataValidateError("Text not specified")
        return text

    def to_dict(self, add_article_info: bool = False):
        """
        Конвертируем сущность Comment в словарь, при необходимости добавляем информацию о статье
        :param add_article_info: True, если нужно добавить информацию о статье
        :return: Словарь
        """
        result = {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}
        del result["author_id"]
        result["author"] = self.author.username

        if add_article_info:
            del result["article_id"]
            result["article"] = self.article.to_dict()

        return result

    def __repr__(self):
        return (f"<Comment. id: {self.id}, article: {self.article.title}, author: {self.author.username}, "
                f"text: {self.text}>")
