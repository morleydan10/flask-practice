function UserDetails({currentUser, logout}) {

  return (
    <div className='user-details'>
      <h2>Welcome {currentUser?.name}!</h2>
      <h3>You have ${currentUser?.money}!</h3>
      <button onClick={logout}>Logout</button>
    </div>
  )

}

export default UserDetails