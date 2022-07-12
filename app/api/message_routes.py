from flask import Blueprint, jsonify, request
from app.models import Message, db
from flask_login import current_user, login_required
from flask_socketio import SocketIO, emit
from app import socketio


message_routes = Blueprint('messages', __name__)
# stili_routes = Blueprint('message', __name__)

# @stili_routes.route('', methods=["POST"])
@message_routes.route('/new', methods=["GET","POST"])
@login_required
def send_message():
    data = request.get_json()

    newMsg = Message(
        user_id=data['user_id'],
        body=data['body'],
        message_type='text',
        edited=False
    )
    print(newMsg.to_dict())
    socketio.emit('chat', newMsg.to_dict())
    db.session.add(newMsg)
    db.session.commit()

    return newMsg.to_dict()


@message_routes.route('/load', methods=['GET'])
@login_required
def load_messages():
    #add channel Id
    messages = Message.query.order_by(Message.id).all()
    rList = {}
    for message in messages:
        tmp = message.to_dict()
        tmpId = tmp['id']
        rList[tmpId] = tmp
    return jsonify(rList)

@message_routes.route('/delete/<int:id>', methods=['DELETE'])
@login_required
def deleteMsg(id):
    socketio.emit('delMsg', id)
    msg = Message.query.filter_by(id=id).first()
    db.session.delete(msg)
    db.session.commit()


    messages = Message.query.order_by(Message.id).all()
    rList = {}
    for message in messages:
        tmp = message.to_dict()
        tmpId = tmp['id']
        rList[tmpId] = tmp
    return jsonify(rList)
