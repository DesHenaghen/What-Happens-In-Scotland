from server import sio


@sio.on('connect')
def connect(sid, environ):
    print('connect ', sid)


@sio.on('my message')
def message(sid, data):
    print('message ', data)


@sio.on('disconnect')
def disconnect(sid):
    print('disconnect ', sid)
