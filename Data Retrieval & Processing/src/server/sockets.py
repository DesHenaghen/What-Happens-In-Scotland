from flask import request
from server import get_socketio_instance

socketio = get_socketio_instance()


@socketio.on('connect')
def test_connect():
    print('connect', request.sid)
    socketio.emit('my_response', {'data': 'Connected', 'count': 0})


@socketio.on('message')
def message(data):
    print('message ', data)
    socketio.emit('message', {'data': 'hi', 'count': 69})


@socketio.on('disconnect')
def disconnect():
    print('disconnect ', request.sid)
