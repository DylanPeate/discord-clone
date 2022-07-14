from app.models import db, User
from datetime import date


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', password='password', phone_number='4154171991', about_me='', birthday=date(2000, 1, 1), online_status='online')
    john = User(
        username='seedData4lyf', email='john@aa.io', password='password', phone_number='2524142434', about_me='I love seed data', birthday=date(1887, 6, 3), online_status='online')
    dylan = User(
        username='Dylan', email='info@dylanpeate.com', password='password', phone_number='7722336222', about_me='', birthday=date(2002, 1, 12), online_status='away'
    )
    fino = User(
        username='Gorilla', email='elisaia55@yahoo.com', password='password', phone_number='5102849432', about_me='bad at football', birthday=date(1997, 4, 13), online_status='DND'
    )
    patrick = User(
        username='Flakes', email='p.mcginn.m@gmail.com', password='password', phone_number='8022822223', about_me='Tarkov Enjoyer', birthday=date(1992,3,24), online_status='online'
    )

    db.session.add(demo)
    db.session.add(john)
    db.session.add(dylan)
    db.session.add(fino)
    db.session.add(patrick)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
