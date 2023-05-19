import './css/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import whatsAppClient from '@green-api/whatsapp-api-client'
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
  const [messages, setMessages] = useState([])
  const [isSent, setIsSent] = useState(false)
  const [newSentMessage, setNewSentMessage] = useState([])

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
    setNewSentMessage(newMessage)
    setIsSent(true)
  }

  useEffect(() => {
    ;(async function () {
      if (isSent && !!newSentMessage) {
        try {
          const request = {
            method: 'POST',
            body: JSON.stringify({
              chatId: `${phoneNumber.substring(1)}@c.us`,
              message: `${newSentMessage.text}`
            })
          }
          const res = await fetch(
            `https://api.green-api.com/waInstance${userData.idInstance}/SendMessage/${userData.apiTokenInstance}`,
            request
          )
          const response = await res.json()
          console.log(response)
        } catch (e) {
          setError(e.message)
          console.log(e.message)
        } finally {
          setIsSent(false)
        }
      }
    })()
  }, [
    userData.idInstance,
    userData.apiTokenInstance,
    phoneNumber,
    messages,
    isSent,
    setIsSent,
    newSentMessage
  ])

  useEffect(() => {
    ;(async () => {
      if (chatCreated) {
        let restAPI = whatsAppClient.restAPI({
          idInstance: userData.idInstance,
          apiTokenInstance: userData.apiTokenInstance
        })
        try {
          await restAPI.webhookService.startReceivingNotifications()
          restAPI.webhookService.onReceivingMessageText(body => {
            console.log('onReceivingMessageText', body)
            const newMessage = {
              text: body.messageData.textMessageData.textMessage,
              isSent: false,
              id: uuidv4()
            }
            setMessages([...messages, newMessage])
            restAPI.webhookService.stopReceivingNotifications()
          })
        } catch (ex) {
          console.error(ex)
        }
      }
    })()
  }, [userData, chatCreated, messages, setMessages])

  return (
    <div className='App'>
      {isSignedIn ? (
        chatCreated ? (
          <Chat
            phoneNumber={phoneNumber}
            messages={messages}
            handleSendMessage={handleSendMessage}
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
      )}
    </div>
  )
}

export default App
