#!/usr/bin/env python3

from flask import Flask, make_response, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import datetime
from models import db, Duck
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False

migrate = Migrate(app, db)

db.init_app(app)

# ducks = [
#     {
#         "id": 1,
#         "name": "Duck Shrute",
#         "img_url": "https://cdn11.bigcommerce.com/s-nf2x4/images/stencil/1280x1280/products/246/9133/Computer-Geek-Rubber-Duck-Schanables-3__49617.1644583506.jpg?c=2",
#         "likes": 777,
#     },
#     {
#         "id": 2,
#         "name": "Quacker Jack Kid",
#         "img_url": "https://m.media-amazon.com/images/I/51NG84N1jrL._AC_SS450_.jpg",
#         "likes": 1,
#     },
#     {
#         "id": 3,
#         "name": "Duckly Von Quackenstein",
#         "img_url": "https://www.essexduck.com/uploads/1/3/2/0/132064494/s101382617522703170_p335_i1_w500.jpeg",
#         "likes": 10,
#     },
#     {
#         "id": 4,
#         "name": "The Quacken",
#         "img_url": "https://res.cloudinary.com/teepublic/image/private/s--qPJEf-Tj--/c_crop,x_10,y_10/c_fit,w_1109/c_crop,g_north_west,h_1260,w_1260,x_-112,y_-76/co_rgb:0f0f0f,e_colorize,u_Misc:One%20Pixel%20Gray/c_scale,g_north_west,h_1260,w_1260/fl_layer_apply,g_north_west,x_-112,y_-76/bo_157px_solid_white/e_overlay,fl_layer_apply,h_1260,l_Misc:Art%20Print%20Bumpmap,w_1260/e_shadow,x_6,y_6/c_limit,h_1134,w_1134/c_lpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_630,q_90,w_630/v1627667803/production/designs/23373019_0.jpg",
#         "likes": 9006,
#     },
#     {
#         "id": 5,
#         "name": "Spiderduck",
#         "img_url": "https://amsterdamduckstore.com/wp-content/uploads/2015/08/spidy-rubber-duck-leaning.jpg",
#         "likes": 7,
#     },
#     {
#         "name": "New Ducky",
#         "img_url": "https://www.essexduck.com/uploads/1/3/2/0/132064494/s101382617522703170_p335_i1_w500.jpeg",
#         "likes": 0,
#         "id": 6,
#     },
# ]


@app.get("/")
def index():
    return "ducks backend"


@app.get("/ducks/")
def get_ducks():
    # list of duck python objects
    ducks = Duck.query.all()
    # [duck1.to_dict(), duck2.to_dict(),duck3.to_dict()]
    return [d.to_dict() for d in ducks], 200


@app.patch("/ducks/<int:id>")
def patch_ducks(id):
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
