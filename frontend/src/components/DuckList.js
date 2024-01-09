import React from "react";
import DuckListCard from "./DuckListCard";

function DuckList({ ducks, handleClickDuck, handleDelete }) {
    const mappedDucks = ducks.map((duck) => (
        <DuckListCard
            key={duck.id}
            duck={duck}
            handleClickDuck={handleClickDuck}
            handleDelete={handleDelete}
        />
    ));

    return <div className="duck-nav">{mappedDucks}</div>;
}

export default DuckList;
