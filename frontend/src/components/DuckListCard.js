function DuckListCard({ duck, handleClickDuck, handleDelete }) {
    
    return (
        <>
            <img
                onClick={() => handleClickDuck(duck)}
                src={duck.img_url}
                alt={duck.name}
            />
            <button onClick={() => handleDelete(duck)}>Delete</button>
        </>
    );
}

export default DuckListCard;
