from .db import db

class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False, unique = False)
    body = db.Column(db.String(2000), nullable = True, unique = False)
    message_type = db.Column(db.String(), nullable = False, unique = False)
    image_link = db.Column(db.String(), nullable = True, unique = False)
    edited = db.Column(db.Boolean, nullable = False, unique = False)
    channel_id = db.Column(db.Integer, db.ForeignKey('channels.id'), nullable = True)

    users = db.relationship('User', back_populates='messages')
    channels = db.relationship('Channel', back_populates='messages')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'body': self.body,
            'message_type': self.message_type,
            'image_link': self.image_link
        }
