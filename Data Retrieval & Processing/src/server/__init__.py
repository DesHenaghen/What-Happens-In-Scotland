import os
import socketio
import eventlet
from flask import Flask

sio = socketio.Server()
template_dir = os.path.abspath('../../Client/dist/')
print(template_dir)
app = Flask(__name__, template_folder=template_dir, static_url_path='/../../Client/dist')


if __name__ == '__main__':
    # wrap Flask application with socketio's middleware
    app = socketio.Middleware(sio, app)

    # deploy as an eventlet WSGI server
    eventlet.wsgi.server(eventlet.listen(('', 8000)), app)

from server import routes, sockets
