

function DuckDisplay({ featuredDuck }) {


    

    return (
         <div className="duck-display">
            {/* show all the details for the featuredDuck state here */}

            <h2>
                {featuredDuck?.name} is currently eating{" "}
                {featuredDuck?.food?.name ? featuredDuck.food.name : "nothing"}
            </h2>

            <img src={featuredDuck.img_url} alt={featuredDuck.name} />
        </div>
    );
}

export default DuckDisplay;
