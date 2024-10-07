import os
from config import config
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy


def create_app(config_mode):
    appFlask = Flask(__name__)
    appFlask.config.from_object(config[config_mode])

    db.init_app(appFlask)
    migrate.init_app(appFlask, db)

    return appFlask


db = SQLAlchemy()
migrate = Migrate()
app = create_app(os.getenv("CONFIG_MODE"))
jwt = JWTManager(app)

from account import routes
from articles import routes
from comments import routes
from users import routes

if __name__ == "__main__":
    app.run()
