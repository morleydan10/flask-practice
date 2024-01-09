import React, { useState, useEffect } from 'react'
import DuckList from './DuckList'
import DuckDisplay from "./DuckDisplay"
import DuckForm from "./DuckForm"

function App() {

  const [ducks, setDucks] = useState([])
  const [featuredDuck, setFeaturedDuck] = useState({})
  const [duckFormOpen, setDuckFormOpen] = useState(true)

  function handleClickDuck(duck) {
    setFeaturedDuck(duck)
  }

  function handleClickForm() {
    setDuckFormOpen(!duckFormOpen)
  }

  function handleDelete(duck) {
    fetch(`http://localhost:5555/ducks/${duck.id}`, {
        method: "DELETE"
    }).then(res => res.json())
    .then(data => console.log(data))
    setDucks(ducks.filter(d => d.id !== duck.id))
  }

  function postNewDuck(newDuck) {
    fetch('http://localhost:5555/ducks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newDuck)
    })
    .then(res => res.json())
    .then(newDuckFromServer => setDucks([...ducks, newDuckFromServer]))
  }

  useEffect(() => {
    fetch('http://localhost:5555/ducks')
    .then(res => res.json())
    .then(data => setDucks(data))
  }, [])

  useEffect(() => {
    console.log('duckFormOpen Has Changed!')
    // this is just for demonstration purposes
  }, [duckFormOpen])

  return (
    <div className="App">

      <h1>Duck Manager 2022 - React Edition</h1>

      <DuckList ducks={ducks} handleClickDuck={handleClickDuck} handleDelete={handleDelete} />

      <DuckDisplay featuredDuck={featuredDuck} />

      <button onClick={() => handleClickForm()}>{duckFormOpen ? "Close" : "Open" } Duck Form</button>

      { duckFormOpen ? <DuckForm postNewDuck={postNewDuck} /> : null }

    </div>
  );
}

export default App;
