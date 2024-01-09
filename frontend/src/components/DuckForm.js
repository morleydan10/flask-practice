import React, { useState } from 'react'

function DuckForm({postNewDuck}) {

  const [name, setName] = useState('')
  const [image, setImage] = useState('')

  function handleNameChange(event) {
    setName(event.target.value)
  }

  function handleImageChange(event) {
    setImage(event.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault()
    postNewDuck({name: name, img_url: image, likes: 0})
    // id gets added by the json-server so we don't include it
  }

  return (
    <form id="new-duck-form" onSubmit={handleSubmit}>

       <label htmlFor="duck-name-input">New Duck Name:</label>
       <input type="text" name="duck-name-input" value={name} onChange={handleNameChange} />

       <label htmlFor="duck-image-input">New Duck Image URL:</label>
       <input type="text" name="duck-image-input" value={image} onChange={handleImageChange} />

       <input type="submit" value="Create Duck" />

    </form>
  )
}

export default DuckForm
