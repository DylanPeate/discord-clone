from .db import db

class Server_User(db.Model):
    __tablename__ = 'server_users'

    id = db.Column(db.Integer, primary_key=True)
    server_id = db.Column(db.Integer, db.ForeignKey('servers.id'), nullable = False, unique = True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False, unique = False)

    servers = db.relationship('Server', back_populates='server_users')
    users = db.relationship('User', back_populates='server_users')
