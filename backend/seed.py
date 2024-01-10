from app import app
from models import User, Duck, Food, db
import json

if __name__ == "__main__":
    with app.app_context():
        data = {}
        with open("db.json") as f:
            data = json.load(f)
        User.query.delete()
        Duck.query.delete()
        Food.query.delete()

        user_list = []
        for user in data["users"]:
            u = User(name=user.get("name"), money=user.get("money"))
            user_list.append(u)
        db.session.add_all(user_list)
        db.session.commit()

        for food in data["foods"]:
            f = Food(
                name=food.get("name"),
                cost=food.get("cost"),
                img_url=food.get("img_url"),
            )
            db.session.add(f)
            db.session.commit()

        for duck in data["ducks"]:
            d = Duck(
                name=duck.get("name"),
                likes=duck.get("likes"),
                img_url=duck.get("img_url"),
                user=user_list[0],
                food=None
            )
            db.session.add(d)
            db.session.commit()
print("seeding complete")      
