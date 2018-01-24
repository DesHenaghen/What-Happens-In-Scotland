from server import create_app, get_socketio_instance

app = create_app(debug=True)
socketio = get_socketio_instance()

if __name__ == '__main__':
    socketio.run(app)
