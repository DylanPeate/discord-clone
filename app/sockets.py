from flask_socketio import SocketIO, emit, join_room, leave_room
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
    emit("chat", data, to=str(data['channel_id']), broadcast=True)
    print(f"==========Sent {data} to {data['channel_id']}==========")


@socketio.on('join')
def onJoin(room):
    join_room(room)
    print(f"====================================joined Room{room}====================================")


@socketio.on('leave')
def onLeave(room):
    leave_room(room)
    print(f"left {room}")
