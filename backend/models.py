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


class Duck(db.Model, SerializerMixin):
    __tablename__ = "duck_table"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    img_url = db.Column(db.String)
    likes = db.Column(db.Integer)
    
    # SerializerMixin writes this for us
    # def to_dict(self):
    #     return {
    #         "id": self.id,
    #         "name": self.name,
    #         "img_url": self.img_url,
    #         "likes": self.likes,
    #     }
