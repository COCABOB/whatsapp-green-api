import './css/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SignIn from './components/SignIn'

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [stateInstance, setStateInstance] = useState([])
  const [error, setError] = useState('')
  const [userData, setUserData] = useState([])
  const handleSignIn = userData => {
    setUserData(userData)
    console.log(userData)
  }
  useEffect(() => {
    ;(async function () {
      try {
        const res = await fetch(
          `https://api.green-api.com/waInstance${userData.idInstance}/getStateInstance/${userData.apiTokenInstance}`
        )
        const response = await res.json()
        setStateInstance(response)
        // (res => res.json())(json => setIsSignedIn(json))
      } catch (e) {
        setError(e.message)
        console.log(e.message)
      } finally {
        if (stateInstance.stateInstance === 'authorized') {
          setIsSignedIn(true)
        } else {
          setIsSignedIn(false)
        }
      }
    })()
  }, [
    userData.idInstance,
    userData.apiTokenInstance,
    stateInstance.stateInstance
  ])

  // useEffect(() => {
  //   fetch(
  //     `https://api.green-api.com/waInstance${userData.idInstance}/getStateInstance/${userData.apiTokenInstance}`
  //   )
  //     .then(res => res.json())
  //     .then(json => setIsSignedIn(json))
  //     .catch(e => setError(e))
  // }, [])

  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
          <Route
            path='sign-in'
            element={
              <SignIn
                isSignedIn={isSignedIn}
                error={error}
                handleSignIn={handleSignIn}
              />
            }
          />
          <Route path='chats' element='' />
          <Route path='chats/uid' element='' />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
