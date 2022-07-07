from flask import Blueprint, jsonify, request
from app.models import User, db
from flask_login import current_user, login_required
from app.aws_s3 import (
    upload_file_to_s3, allowed_file, get_unique_filename
)

s3_routes = Blueprint('s3', __name__)



@s3_routes.route('/upload/profile_pic', methods=["POST"])
@login_required
def upload_profile_pic():
    userId = current_user.id
    print(userId)
    if 'image' not in request.files:
        return {"errors": "image required"}, 400

    image = request.files["image"]

    if not allowed_file(image.filename):
        return {"errors": "file type not permitted"}, 400

    image.filename = get_unique_filename(image.filename)

    upload = upload_file_to_s3(image)

    if "url" not in upload:
        return upload, 400

    url = upload["url"]
    #find user add profile pic to user
    thisUser = User.query.filter(User.id==userId).first()
    thisUser.profile_pic = str(url)
    db.session.commit()
    return {"url": url}
