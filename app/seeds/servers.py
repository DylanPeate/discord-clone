from app.models import db, Server

def seed_servers():
    server1 = Server(
        owner_id=3, icon='http://discord-clone-bucket.s3.amazonaws.com/06e44dce8e254254809164e28bfb790b.png', name='App Academy', default_channel_id=1
    )
    server2 = Server(
        owner_id=3, icon='https://discord-clone-bucket.s3.amazonaws.com/kisspng-react-javascript-responsive-web-design-github-angu-github-5accac250cda95.4452823815233628530527.png', name='The Lounge',default_channel_id=4
    )

    db.session.add(server1)
    db.session.add(server2)
    db.session.commit()

def undo_servers():
    db.session.execute('TRUNCATE servers RESTART IDENTITY CASCADE;')
    db.session.commit()
