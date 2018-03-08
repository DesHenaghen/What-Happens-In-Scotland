from flask import request
from server import get_socketio_instance

socketio = get_socketio_instance()


# @socketio.on('connect')
# def test_connect():
#     # print('connect', request.sid)
#
#
# @socketio.on('message')
# def message(data):
#     # print('message ', data)
#
#
# @socketio.on('disconnect')
# def disconnect():
#     # print('disconnect ', request.sid)
