import { useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom'
import Nav from './Nav'

const App = () => {
  const localStorageName = localStorage.getItem('username')
  console.log(localStorage.getItem('username'));
  return (
    <>
    <Nav />
      <div className='content'>
        <h1>Hello from the main page of the app!</h1>
        <p>Here are some examples of links to other pages.</p>
        <p>Local Storage name {localStorageName} </p>
        <nav>
          <ul>
            <li>
              <Link to='/posts'>Posts, this will be changed to / in the future</Link>
            </li>
            <li>
              <Link to='/log-in'>Log in</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>

  )
}

export default App