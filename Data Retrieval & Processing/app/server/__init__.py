import gevent
from gevent import monkey
from flask import Flask
from flask_socketio import SocketIO
monkey.patch_all()


def get_app_instance():
    return __app


def get_socketio_instance():
    try:
        return __socketio
    except NameError:
        return None


def __start_twitterstream_thread():
    from ScotlandTwitterStream import main as twitter_main
    gevent.spawn(twitter_main)


def create_app(debug=False):

    global __socketio
    __socketio = SocketIO(async_mode="gevent")

    """Create an application."""
    app = Flask(__name__)
    global __app
    __app = app

    app.debug = debug

    from .routes import data_routes
    app.register_blueprint(data_routes)

    __socketio.init_app(app)

    __start_twitterstream_thread()

    return app
