from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Server, Channel, db

channel_routes = Blueprint('channels', __name__)

@channel_routes.route('/<int:serverId>')
@login_required
def channels(serverId):
    channelList = {}
    allChannels = Channel.query.all()
    for channel in allChannels:
        tmp = channel.to_dict()
        if(tmp['server_id'] == serverId):
            channelList[tmp['id']] = tmp
    return jsonify(channelList)

@channel_routes.route('/new', methods=['POST'])
@login_required
def new_channel():
    data = request.get_json()

    newChannel = Channel(
        owner_id=data['owner_id'],
        name=data['name'],
        channel_type=data['channel_type'],
        server_id=data['server_id'],
        default_status=False,
    )
    db.session.add(newChannel)
    db.session.commit()
    newChannel = newChannel.to_dict()
    return jsonify(newChannel)

@channel_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def del_channel(id):
    channel = Channel.query.filter_by(id=id).first()
    db.session.delete(channel)
    db.session.commit()
    return jsonify('Channel Deleted')

@channel_routes.route('/edit/<int:id>', methods=['POST'])
@login_required
def edit_channel(id):
    data = request.get_json()
    ch = Channel.query.filter_by(id=id).first()
    ch.name = data['name']
    db.session.commit()

    return ch.to_dict()
