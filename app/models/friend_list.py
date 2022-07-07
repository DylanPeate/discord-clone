from .db import db

# class Friend_List(db.Model):
#     __tablename__ = 'friend_lists'

#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)
#     friend_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

#     users = db.relationship('User', back_populates='friend_lists')
#     # users = db.relationship('User', back_populates='friend_lists', foreign_keys=[friend_id])

friend_list = db.Table(
    'friend_lists',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('friend_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)
