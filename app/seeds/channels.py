from app.models import db, Channel

def seed_channels():
    #server1
    general = Channel(
        owner_id=3, name='general', channel_type='text', server_id=1, default_status=True
    )
    FAQ = Channel(
        owner_id=3, name='help-requests', channel_type='text', server_id=1, default_status=False
    )
    networking = Channel(
        owner_id=3, name='networking', channel_type='text', server_id=1, default_status=False
    )

    #server2
    general2 = Channel(
        owner_id=3, name='general', channel_type='text', server_id=2, default_status=True
    )
    chat1 = Channel(
        owner_id=3, name='chat-1', channel_type='text', server_id=2, default_status=True
    )
    chat2 = Channel(
        owner_id=3, name='chat-2', channel_type='text', server_id=2, default_status=True
    )

    db.session.add(general)
    db.session.add(FAQ)
    db.session.add(networking)
    db.session.add(general2)
    db.session.add(chat1)
    db.session.add(chat2)
    db.session.commit()

def undo_channels():
    db.session.execute('TRUNCATE channels RESTART IDENTITY CASCADE;')
    db.session.commit()
