from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
import string, datetime

metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)
db = SQLAlchemy(metadata=metadata)

class User(db.Model, SerializerMixin):
    __tablename__ = "user_table"
    serialize_rules = ["-ducks.user"]
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    money = db.Column(db.Integer, default=100)

    ducks = db.relationship("Duck", back_populates="user")

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