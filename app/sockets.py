from flask_socketio import SocketIO, emit
from .models.message import Message
import os


if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://dylanpeate.com",
        "https://dylanpeate.com"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins="*")
#, logger=True, engineio_logger=True

@socketio.on('chat')
def handle_chat(data):
    emit("chat", data, broadcast=True)



# @socketio.on_error_default
# def default_error_handler(e):
#     print(e)
#     pass
