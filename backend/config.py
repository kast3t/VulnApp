import os
from datetime import timedelta

pg_user = os.getenv("POSTGRES_USER")
pg_pwd = os.getenv("POSTGRES_PASSWORD")
pg_db = os.getenv("POSTGRES_DB")


class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    JSON_AS_ASCII = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_TOKEN_LOCATION = "cookies"
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_SESSION_COOKIE = False
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_CSRF_IN_COOKIES = False


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = f"postgresql+psycopg2://{pg_user}:{pg_pwd}@db:5432/{pg_db}"


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = f"postgresql+psycopg2://{pg_user}:{pg_pwd}@db:5432/{pg_db}"


config = {
    "dev": DevelopmentConfig,
    "prod": ProductionConfig
}
