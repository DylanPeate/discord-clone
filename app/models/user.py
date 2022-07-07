from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(10), nullable=True, unique=True)
    profile_pic = db.Column(db.String(), nullable=True, unique=False)
    about_me = db.Column(db.String(190), nullable=True, unique=False)
    birthday = db.Column(db.Date, nullable=False, unique=False)
    online_status = db.Column(db.String(), nullable=False, unique=False)

    messages = db.relationship('Message', back_populates='users', cascade='all,delete')
    channels = db.relationship('Channel', back_populates='users', cascade='all,delete')
    servers = db.relationship('Server', back_populates='users', cascade='all,delete')
    # friend_lists = db.relationship('Friend_List', back_populates='users', cascade='all, delete')
    server_users = db.relationship('Server_User', back_populates='users', cascade='all,delete')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'phone_number': self.phone_number,
            'profile_pic': self.profile_pic,
            'about_me': self.about_me,
            'birthday': self.about_me,
            'online_status': self.online_status
        }
