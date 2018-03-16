import sys

from server import create_app, get_socketio_instance

application = create_app(debug=False)


def __run_app():
    socketio.run(application)


if __name__ == '__main__':
    try:
        socketio = get_socketio_instance()

        print("Starting the app")
        socketio.run(application, host='localhost')

    except KeyboardInterrupt as e:
        print("Killing myself now as an error occurred")
        print(e)
        sys.exit(0)
