import React from "react";
import DuckListCard from "./DuckListCard";

function DuckList({ ducks, handleClickDuck, handleDelete, user }) {
    const mappedDucks = ducks.map((duck) => (
        <DuckListCard
            key={duck.id}
            duck={duck}
            handleClickDuck={handleClickDuck}
            handleDelete={handleDelete}
        />
    ));

    return user&& <div className="duck-nav">
        <h2>Welcome {user?.name}, here are your ducks! You have ${user.money}</h2>
        {mappedDucks}
        </div>;
}

export default DuckList;
