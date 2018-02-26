from threading import Thread

import sys

from server import create_app, get_socketio_instance

application = create_app(debug=False)


def __run_app():
    socketio.run(application)


if __name__ == '__main__':
    try:
        socketio = get_socketio_instance()

        # from twitterStream import main as twitter_main
        # from ScotlandTwitterStream import main as twitter_main
        # print("Thread should be starting now")
        # twitter_stream_thread = Thread(name="twitter_stream", target=twitter_main)
        # twitter_stream_thread.start()

        app_thread = Thread(name="application", target=socketio.run(application, host='0.0.0.0'))
        # twitter_main()

    except KeyboardInterrupt as e:
        print("Killing myself now as an error occurred")
        print(e)
        sys.exit(0)
