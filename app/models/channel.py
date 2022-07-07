from .db import db

class Channel(db.Model):
    __tablename__ = 'channels'

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=False)
    name = db.Column(db.String(30), nullable = False, unique = False)
    # message_id = db.Column(db.Integer, db.ForeignKey('messages.id'), nullable = False, unique = False)
    channel_type = db.Column(db.String(), nullable = False, unique = False)

    users = db.relationship('User', back_populates='channels')
    # messages = db.relationship('Message', back_populates='channels', cascade='all,delete')
    messages = db.relationship('Message', back_populates='channels')
    servers = db.relationship('Server', back_populates='channels')

    def to_dict(self):
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'name': self.name,
            'message_id': self.message_id,
            'channel_type': self.channel_type
        }
