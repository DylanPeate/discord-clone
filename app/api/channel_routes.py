from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Server, Channel

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
