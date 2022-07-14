from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Server, Server_User, Channel

server_routes = Blueprint('servers', __name__)


#get all servers a user is in
@server_routes.route('/<int:id>')
@login_required
def servers(id):
    joinedServers = []
    server_users = Server_User.query.all()
    for user in server_users:
        userTmp = user.to_dict()
        if(userTmp['user_id'] == id):
            joinedServers.append(userTmp['server_id'])

    serverList = {}
    allServers = Server.query.all()
    for serverId in joinedServers:
        serverObj = Server.query.filter_by(id=serverId).first()
        serverObj = serverObj.to_dict()
        serverList[serverObj['id']] = serverObj

    return jsonify(serverList)
