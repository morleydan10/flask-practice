from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
import string, datetime

metadata = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s",
    }
)
db = SQLAlchemy(metadata=metadata)


class User(db.Model, SerializerMixin):
    __tablename__ = "user_table"
    serialize_rules = ["-ducks.user"]
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    money = db.Column(db.Integer, default=100)
    password_hash = db.Column(db.String)
    ducks = db.relationship("Duck", back_populates="user")

    @validates("name")
    def validate_name(self, key, name):
        print(f"key {key} name {name}")
        if not name or "z" in name.lower():
            raise ValueError("useful message")
        return name


class Duck(db.Model, SerializerMixin):
    __tablename__ = "duck_table"
    serialize_rules = ["-user.ducks", "-food.ducks"]
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    img_url = db.Column(db.String)
    likes = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("user_table.id"))
    food_id = db.Column(db.Integer, db.ForeignKey("food_table.id"))

    user = db.relationship("User", back_populates="ducks")
    food = db.relationship("Food", back_populates="ducks")
    # SerializerMixin writes this for us
    # def to_dict(self):
    #     return {
    #         "id": self.id,
    #         "name": self.name,
    #         "img_url": self.img_url,
    #         "likes": self.likes,
    #     }


class Food(db.Model, SerializerMixin):
    __tablename__ = "food_table"
    serialize_rules = ["-ducks.food"]
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    cost = db.Column(db.Integer)
    img_url = db.Column(db.String)

    ducks = db.relationship("Duck", back_populates="food")
