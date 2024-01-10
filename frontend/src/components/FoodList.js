import React from "react";
import FoodCard from "./FoodCard";

function FoodList({ foods, feedDuck, user }) {
    const mappedDucks = foods.map((food) => (
        <FoodCard
            key={food.id}
            food={food}
            feedDuck={feedDuck}
        />
    ));

    return <div className="duck-nav">
        <h2>Click a food to feed to duck!</h2>
        {mappedDucks}
        </div>;
}

export default FoodList;
