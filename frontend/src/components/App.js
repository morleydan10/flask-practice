import React, { useState, useEffect } from "react";
import DuckList from "./DuckList";
import DuckDisplay from "./DuckDisplay";
import DuckForm from "./DuckForm";
import FoodList from "./FoodList";

const PORT = 5555;
function App() {
    const [user, setUser] = useState(null);
    const [foods, setFoods] = useState([]);
    const [ducks, setDucks] = useState([]);
    const [featuredDuck, setFeaturedDuck] = useState({});
    const [duckFormOpen, setDuckFormOpen] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:${PORT}/ducks`)
            .then((res) => res.json())
            .then((data) => {
                setDucks(data);
                setFeaturedDuck(data[0]);
            });
        fetch(`http://localhost:${PORT}/users/1`)
            .then((res) => res.json())
            .then((data) => setUser(data));
        fetch(`http://localhost:${PORT}/foods`)
            .then((res) => res.json())
            .then((data) => setFoods(data));
    }, []);

    function handleClickDuck(duck) {
        setFeaturedDuck(duck);
    }

    function handleClickForm() {
        setDuckFormOpen(!duckFormOpen);
    }

    function feedDuck(clickedFood) {
        setDucks(
            ducks.map((duck) => {
                if (duck.id === featuredDuck.id) {
                    duck.food_id = clickedFood.id;
                }
                return duck;
            })
        );
        console.log(clickedFood);
        setFeaturedDuck({ ...featuredDuck, food_id: clickedFood.id, food: clickedFood });
        console.log(featuredDuck)
        fetch(`http://localhost:${PORT}/ducks/${featuredDuck.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ food_id: clickedFood.id }),
        });

        setUser({ ...user, money: user.money - clickedFood.cost });
        fetch(`http://localhost:${PORT}/users/${user.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ money: user.money - clickedFood.cost }),
        });
    }
    function handleDelete(duck) {
        fetch(`http://localhost:${PORT}/ducks/${duck.id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((data) => console.log(data));
        setDucks(ducks.filter((d) => d.id !== duck.id));
    }

    function postNewDuck(newDuck) {
        fetch(`http://localhost:${PORT}/ducks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newDuck),
        })
            .then((res) => res.json())
            .then((newDuckFromServer) =>
                setDucks([...ducks, newDuckFromServer])
            );
    }

    useEffect(() => {
        console.log("duckFormOpen Has Changed!");
        // this is just for demonstration purposes
    }, [duckFormOpen]);

    return (
        <div className="App">
            <h1>Duck Manager</h1>

            <DuckList
                ducks={ducks}
                handleClickDuck={handleClickDuck}
                handleDelete={handleDelete}
                user={user}
            />

            <DuckDisplay featuredDuck={featuredDuck} PORT={PORT} />
            <FoodList foods={foods} feedDuck={feedDuck} user={user} />
            <button onClick={() => handleClickForm()}>
                {duckFormOpen ? "Close" : "Open"} Duck Form
            </button>

            {duckFormOpen ? <DuckForm postNewDuck={postNewDuck} /> : null}
        </div>
    );
}

export default App;
