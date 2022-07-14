from flask import Blueprint, jsonify, request
from app.models import Message, db
from flask_login import current_user, login_required
from flask_socketio import SocketIO, emit
from app import socketio


message_routes = Blueprint('messages', __name__)


@message_routes.route('/edit/<int:id>', methods=["POST"])
@login_required
def edit_message(id):
    data = request.get_json()
    msg = Message.query.filter_by(id=id).first()
    msg.body = data['body']
    msg.edited = True
    db.session.commit()

    socketio.emit('edit', msg.to_dict())
    return msg.to_dict()


@message_routes.route('/new', methods=["GET","POST"])
@login_required
def send_message():
    data = request.get_json()


    newMsg = Message(
        user_id=data['user_id'],
        body=data['body'],
        message_type='text',
        image_link='',
        edited=False,
        channel_id=data['channel_id'],
    )
    db.session.add(newMsg)
    db.session.commit()
    message = newMsg.to_dict()
    socketio.emit('chat', message, to=message['channel_id'], broadcast=True)
    return newMsg.to_dict()


@message_routes.route('/load', methods=['GET'])
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
    return jsonify('message deleted')
