function FoodCard({ food, feedDuck }) {
    
    return (
        <>
            <img
                src={food.img_url}
                alt={food.name}
            />
            <button onClick={() => feedDuck(food)}>Feed {food.name} for ${food.cost}</button>
        </>
    );
}

export default FoodCard;