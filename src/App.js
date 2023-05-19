import './css/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import SignIn from './components/SignIn'
import CreateChat from './components/CreateChat'
import Chat from './components/Chat'

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [stateInstance, setStateInstance] = useState([])
  const [error, setError] = useState('')
  const [userData, setUserData] = useState([])
  const [phoneNumber, setPhoneNumber] = useState()
  const [existsWhatsapp, setExistsWhatsapp] = useState()
  const [chatCreated, setChatCreated] = useState(false)
  const [messages, setMessages] = useState([
    {
      text: 'test1',
      isSent: true,
      id: uuidv4()
    },
    {
      text: 'test2',
      isSent: false,
      id: uuidv4()
    },
    {
      text: 'test3',
      isSent: true,
      id: uuidv4()
    }
  ])

  const handleSignIn = userData => {
    setUserData(userData)
    console.log(userData)
  }
  useEffect(() => {
    ;(async function () {
      if (!!userData.idInstance && !!userData.apiTokenInstance) {
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
      }
    })()
  }, [
    userData.idInstance,
    userData.apiTokenInstance,
    stateInstance.stateInstance
  ])

  const handleCheckNumber = phone => {
    setPhoneNumber(phone)
  }

  useEffect(() => {
    ;(async function () {
      if (!!phoneNumber) {
        try {
          const request = {
            method: 'POST',
            body: JSON.stringify({ phoneNumber: `${phoneNumber}` })
          }
          const res = await fetch(
            `https://api.green-api.com/waInstance${userData.idInstance}/CheckWhatsapp/${userData.apiTokenInstance}`,
            request
          )
          const response = await res.json()
          console.log(response)
          if (response.existsWhatsapp === true) {
            setExistsWhatsapp(true)
          } else {
            setExistsWhatsapp(false)
          }
        } catch (e) {
          setError(e.message)
          console.log(e.message)
        } finally {
          console.log(existsWhatsapp)
        }
      }
    })()
  }, [
    userData.idInstance,
    userData.apiTokenInstance,
    phoneNumber,
    existsWhatsapp
  ])

  const handleCreateChat = created => {
    setChatCreated(created)
    setPhoneNumber(phoneNumber)
    console.log(`check - ${chatCreated}`)
  }

  const handleSendMessage = messageText => {
    const newMessage = {
      text: messageText,
      isSent: true,
      id: uuidv4()
    }
    setMessages([...messages, newMessage])
  }

  const handleReceiveMessage = () => {}

  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
          <Route
            path='sign-in'
            element={
              isSignedIn ? (
                chatCreated ? (
                  <Chat
                    phoneNumber={phoneNumber}
                    messages={messages}
                    handleSendMessage={handleSendMessage}
                    handleReceiveMessage={handleReceiveMessage}
                  />
                ) : (
                  <CreateChat
                    isSignedIn={isSignedIn}
                    handleCheckNumber={handleCheckNumber}
                    handleCreateChat={handleCreateChat}
                    existsWhatsapp={existsWhatsapp}
                  />
                )
              ) : (
                <SignIn
                  isSignedIn={isSignedIn}
                  error={error}
                  handleSignIn={handleSignIn}
                />
              )
            }
          />
          {/* <Route
            path='create-chat'
            element={
              <CreateChat
                isSignedIn={isSignedIn}
                handleCheckNumber={handleCheckNumber}
                existsWhatsapp={existsWhatsapp}
                handleCreateChat={handleCreateChat}
              />
            }
          />
          <Route path='chats/uid' element='' /> */}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
