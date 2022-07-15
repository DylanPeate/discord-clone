from app.models import db,Server_User

def seed_server_users():
    demo = Server_User(
        server_id=1, user_id=1
    )
    john = Server_User(
        server_id=1, user_id=2
    )
    dylan = Server_User(
        server_id=1, user_id=3
    )
    fino = Server_User(
        server_id=1, user_id=4
    )
    patrick = Server_User(
        server_id=1, user_id=5
    )
    #server2
    demo2 = Server_User(
        server_id=2, user_id=1
    )
    john2 = Server_User(
        server_id=2, user_id=2
    )
    dylan2 = Server_User(
        server_id=2, user_id=3
    )
    fino2 = Server_User(
        server_id=2, user_id=4
    )
    patrick2 = Server_User(
        server_id=2, user_id=5
    )

    db.session.add(demo)
    db.session.add(john)
    db.session.add(dylan)
    db.session.add(fino)
    db.session.add(patrick)
    db.session.add(demo2)
    db.session.add(john2)
    db.session.add(dylan2)
    db.session.add(fino2)
    db.session.add(patrick2)
    db.session.commit()

def undo_server_users():
    db.session.execute('TRUNCATE server_users RESTART IDENTITY CASCADE;')
    db.session.commit()
