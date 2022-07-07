from .db import db

class Server(db.Model):
    __tablename__ = 'servers'

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False, unique = False)
    channel_id = db.Column(db.Integer, db.ForeignKey('channels.id'), nullable = False, unique = True)
    icon = db.Column(db.String(), nullable = True, unique = False)
    name = db.Column(db.String(), nullable = False, unique = False)

    users = db.relationship('User', back_populates='servers')
    channels = db.relationship('Channel', back_populates='servers')
    server_users = db.relationship('Server_User', back_populates='servers', cascade='all,delete')

    def to_dict(self):
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'channel_id': self.channel_id,
            'icon': self.icon,
            'name': self.name
        }
