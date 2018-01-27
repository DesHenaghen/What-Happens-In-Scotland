import os
from flask import Flask
from flask_socketio import SocketIO

template_dir = os.path.abspath('../../Client/dist/')


def get_app_instance():
    return __app


def get_socketio_instance():
    return __socketio


def create_app(debug=False):
    global __socketio
    __socketio = SocketIO(async_mode='threading')

    """Create an application."""
    app = Flask(__name__, template_folder=template_dir)
    global __app
    __app = app
    print(app.template_folder)
    app.debug = debug

    from .routes import data_routes
    app.register_blueprint(data_routes)

    from .sockets import socketio as s

    __socketio.init_app(app)
    return app
