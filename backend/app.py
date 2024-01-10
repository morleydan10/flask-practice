#!/usr/bin/env python3

from flask import Flask, make_response, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import datetime
from models import db, Duck, User, Food
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False

migrate = Migrate(app, db)

db.init_app(app)



@app.get("/")
def index():
    return "ducks backend"


@app.get("/ducks/")
def get_ducks():
    # list of duck python objects
    ducks = Duck.query.all()
    # [duck1.to_dict(), duck2.to_dict(),duck3.to_dict()]
    return [d.to_dict() for d in ducks], 200

@app.get("/foods")
def get_foods():
    foods = Food.query.all()
    return [f.to_dict() for f in foods], 200 

@app.get('/users/<int:id>')
def get_user_by_id(id):
    user = db.session.get(User, id)
    return user.to_dict(rules=['-ducks'])

@app.patch("/ducks/<int:id>")
def patch_ducks(id):
    print(id)
    data = request.json
    duck = db.session.get(Duck, id)
    # Setting attributes by hand. Use a loop instead
    # if 'likes' in data:
    #     duck.likes = data['likes']
    # if 'name' in data:
    #     duck.name = data['name']
    # if 'img_url' in data:
    #     duck.img_url = data['img_url']
    '''
    data = {"likes": 4, "name":"new name"}
    key = "likes"
    setattr(duck, "likes", data["likes"])
    setattr(duck, "likes", 4)

    setattr(duck, "name", data["name"])
    setattr(duck, "name", "new name")
    '''
    for key in data:
        setattr(duck, key, data[key])
    
    db.session.add(duck)
    db.session.commit()

    return duck.to_dict(), 201 


@app.post("/ducks")
def post_ducks():
    data = request.json
    # data.get(...) vs data[...]
    duck = Duck(
        name=data.get("name"), img_url=data.get("img_url"), likes=data.get("likes")
    )
    db.session.add(duck)
    db.session.commit()
    
    return duck.to_dict(), 201


@app.delete("/ducks/<int:id>")
def delete_duck(id):
    # duck = Duck.query.filter(Duck.id == id).
    duck = db.session.get(Duck, id)
    if not duck:
        return {"error": "duck not found"}, 404
    db.session.delete(duck)
    db.session.commit()
    return {}


if __name__ == "__main__":
    app.run(port=5555, debug=True)
