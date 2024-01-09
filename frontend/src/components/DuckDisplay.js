import React, { useState, useEffect } from 'react'

function DuckDisplay({featuredDuck}) {

  const [currentLikes, setCurrentLikes] = useState(featuredDuck.likes)

  useEffect(() => {
    setCurrentLikes(featuredDuck.likes)
  }, [featuredDuck])

  function handleIncrementLikes() {
    setCurrentLikes(currentLikes + 1)

    fetch(`http://localhost:5555/ducks/${featuredDuck.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({likes: currentLikes + 1})
    })
  }

  return (
    <div className="duck-display">

      {/* show all the details for the featuredDuck state here */}

      <h2>{featuredDuck.name}</h2>

      <img src={featuredDuck.img_url} alt={featuredDuck.name} />

      <button onClick={() => handleIncrementLikes()} >{currentLikes} likes</button>

    </div>
  )
}

export default DuckDisplay
