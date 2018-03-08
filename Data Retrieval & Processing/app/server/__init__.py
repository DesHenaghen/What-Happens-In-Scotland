from threading import Thread

import gevent
from gevent import monkey
from flask import Flask
from flask_socketio import SocketIO
# eventlet.monkey_patch(os=True, select=True, socket=True, thread=False, time=True, psycopg=False)
monkey.patch_all()
# pool = eventlet.GreenPool()

def get_app_instance():
    return __app


def get_socketio_instance():
    return __socketio


def __start_twitterstream_thread():
    from ScotlandTwitterStream import main as twitter_main
    gevent.spawn(twitter_main)
    #twitter_stream_thread = Thread(name="twitter_stream", target=twitter_main)
    #twitter_stream_thread.start()


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

    from .sockets import socketio as s

    __socketio.init_app(app)

    __start_twitterstream_thread()

    return app
