"""hello

Revision ID: bef2866b9b6d
Revises: 
Create Date: 2022-07-07 15:48:59.103748

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bef2866b9b6d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('phone_number', sa.String(length=10), nullable=True),
    sa.Column('profile_pic', sa.String(), nullable=True),
    sa.Column('about_me', sa.String(length=190), nullable=True),
    sa.Column('birthday', sa.Date(), nullable=False),
    sa.Column('online_status', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('phone_number'),
    sa.UniqueConstraint('username')
    )
    op.create_table('channels',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=30), nullable=False),
    sa.Column('channel_type', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('friend_lists',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('friend_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['friend_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'friend_id')
    )
    op.create_table('messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('body', sa.String(length=2000), nullable=True),
    sa.Column('message_type', sa.String(), nullable=False),
    sa.Column('image_link', sa.String(), nullable=True),
    sa.Column('edited', sa.Boolean(), nullable=False),
    sa.Column('channel_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['channel_id'], ['channels.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('servers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=False),
    sa.Column('channel_id', sa.Integer(), nullable=False),
    sa.Column('icon', sa.String(), nullable=True),
    sa.Column('name', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['channel_id'], ['channels.id'], ),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('channel_id')
    )
    op.create_table('server_users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('server_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['server_id'], ['servers.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('server_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('server_users')
    op.drop_table('servers')
    op.drop_table('messages')
    op.drop_table('friend_lists')
    op.drop_table('channels')
    op.drop_table('users')
    # ### end Alembic commands ###
