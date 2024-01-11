import React, { useState, useEffect } from "react";
import DuckList from "./DuckList";
import DuckDisplay from "./DuckDisplay";
import DuckForm from "./DuckForm";
import FoodList from "./FoodList";
import Login from "./Login";
import UserDetails from "./UserDetails";


function App() {
    const [user, setUser] = useState(null);
    const [foods, setFoods] = useState([]);
    const [ducks, setDucks] = useState([]);
    const [featuredDuck, setFeaturedDuck] = useState({});
    const [duckFormOpen, setDuckFormOpen] = useState(true);

    /**********************
        Initial Fetches
    ************************/
    useEffect(() => {
        fetch(`/ducks`)
            .then((res) => res.json())
            .then((data) => {
                setDucks(data);
                setFeaturedDuck(data[0]);
            });
        fetch(`/check_session`).then((res) => {
            if (res.ok) {
                res.json().then((user) => setUser(user));
            }
        });
        fetch(`/foods`)
            .then((res) => res.json())
            .then((data) => setFoods(data));
    }, []);
    /**********************
        Authentication
    ************************/
    function attemptLogin(userInfo) {
        fetch(`/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accepts: "application/json",
            },
            body: JSON.stringify(userInfo),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                throw res;
            })
            .then((data) => setUser(data))
            .catch((e) => console.log(e));
    }
    function logout() {
        fetch(`/logout`, { method: "DELETE" }).then((res) => {
            if (res.ok) {
                setUser(null);
            }
        });
    }
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
        setFeaturedDuck({
            ...featuredDuck,
            food_id: clickedFood.id,
            food: clickedFood,
        });
        // console.log(featuredDuck)
        fetch(`/ducks/${featuredDuck.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ food_id: clickedFood.id }),
        });

        setUser({ ...user, money: user.money - clickedFood.cost });
        fetch(`/users/${user.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ money: user.money - clickedFood.cost }),
        });
    }
    function handleDelete(duck) {
        fetch(`/ducks/${duck.id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((data) => console.log(data));
        setDucks(ducks.filter((d) => d.id !== duck.id));
    }

    function postNewDuck(newDuck) {
        fetch(`/ducks`, {
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


    return (
        <div className="App">
            <h1>Duck Manager</h1>
            {user ? (
                <>
                    <UserDetails currentUser={user} logout={logout} />
                    <DuckList
                        ducks={ducks}
                        handleClickDuck={handleClickDuck}
                        handleDelete={handleDelete}
                    />
                    <DuckDisplay
                        featuredDuck={featuredDuck}
                    />
                    <FoodList foods={foods} feedDuck={feedDuck} user={user} />
                    <button onClick={() => handleClickForm()}>
                        {duckFormOpen ? "Close" : "Open"} Duck Form
                    </button>
                    {duckFormOpen ? (
                        <DuckForm postNewDuck={postNewDuck} />
                    ) : null}
                </>
            ) : (
                <Login attemptLogin={attemptLogin} />
            )}
        </div>
    );
}

export default App;
