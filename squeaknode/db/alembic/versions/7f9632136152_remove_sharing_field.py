"""Remove sharing field

Revision ID: 7f9632136152
Revises: c874732c09b6
Create Date: 2021-08-20 13:58:52.993445

"""
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = '7f9632136152'
down_revision = 'c874732c09b6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('profile', schema=None) as batch_op:
        batch_op.drop_column('sharing')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('profile', schema=None) as batch_op:
        batch_op.add_column(sa.Column('sharing', sa.BOOLEAN(), nullable=False))

    # ### end Alembic commands ###
