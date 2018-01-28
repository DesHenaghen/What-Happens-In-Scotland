from threading import Thread

from server import create_app, get_socketio_instance


def __run_app():
    socketio.run(app)


if __name__ == '__main__':
    app = create_app(debug=False)
    socketio = get_socketio_instance()

    from twitterStream import main as twitter_main
    twitter_stream_thread = Thread(name="twitter_stream", target=twitter_main)
    twitter_stream_thread.start()

    app_thread = Thread(name="app", target=socketio.run(app, host = '0.0.0.0'))

    # app_thread.start()

