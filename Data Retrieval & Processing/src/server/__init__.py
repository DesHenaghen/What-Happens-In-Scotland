from threading import Thread

from flask import Flask
from flask_socketio import SocketIO


def get_app_instance():
    return __app


def get_socketio_instance():
    return __socketio if '__socketio' in vars() or '__socketio' in globals() else None


def __start_twitterstream_thread():
    from ScotlandTwitterStream import main as twitter_main
    print("Thread should be starting now")
    twitter_stream_thread = Thread(name="twitter_stream", target=twitter_main)
    twitter_stream_thread.start()


def create_app(debug=False):

    global __socketio
    __socketio = SocketIO(async_mode='threading')

    """Create an application."""
    app = Flask(__name__)
    global __app
    __app = app
    print(app.template_folder)
    app.debug = debug

    from .routes import data_routes
    app.register_blueprint(data_routes)

    from .sockets import socketio as s

    __socketio.init_app(app)

    __start_twitterstream_thread()

    return app
