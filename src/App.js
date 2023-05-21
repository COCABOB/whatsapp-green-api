import './css/App.css'
import { useState, useEffect } from 'react'

import SignIn from './components/SignIn'
import CreateChat from './components/CreateChat'
import Chat from './components/Chat'

export default function App() {
  // stateInstance - состояние авторизации пользователя в Green API
  const [stateInstance, setStateInstance] = useState([])
  // если isSignedIn - false, пользователю будет показана страница со входом
  const [isSignedIn, setIsSignedIn] = useState(false)
  // в userData хранится idInstance и apiTokenInstance
  const [userData, setUserData] = useState([])

  // state phoneNumber нужен для проверки существования (existsWhatsapp) адресанта в WhatsApp
  const [phoneNumber, setPhoneNumber] = useState()
  const [existsWhatsapp, setExistsWhatsapp] = useState(false)

  // если chatCreated - true, пользователь будет переведен на страницу с созданным чатом
  const [chatCreated, setChatCreated] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = userData => {
    setUserData(userData)
  }
  // Хук для авторизации с введёнными пользователем данными
  useEffect(() => {
    ;(async function () {
      // Хук начнет работу только только после ввода пользователем данных
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
          // Обработка авторизации и присваивание стейту isSignedIn ответ с сервера
          stateInstance.stateInstance === 'authorized'
            ? setIsSignedIn(true)
            : setIsSignedIn(false)
        }
      }
    })()
  }, [
    userData.idInstance,
    userData.apiTokenInstance,
    stateInstance.stateInstance
  ])

  // Номер телефона будет обновляться при его вводе пользователем
  const handleCheckNumber = phone => {
    setPhoneNumber(phone)
  }
  // Обработчик сабмита формы для создания чата
  const handleCreateChat = () => {
    setChatCreated(existsWhatsapp)
    setPhoneNumber(phoneNumber)
  }
  // Хук для проверки существования в WhatsApp введённого номера телефона
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
          response.existsWhatsapp === true
            ? setExistsWhatsapp(true)
            : setExistsWhatsapp(false)
        } catch (e) {
          setError(e.message)
          console.log(e.message)
        }
      }
    })()
  }, [
    userData.idInstance,
    userData.apiTokenInstance,
    phoneNumber,
    existsWhatsapp
  ])

  return (
    <div className='App'>
      {isSignedIn ? (
        chatCreated ? (
          <Chat phoneNumber={phoneNumber} userData={userData} />
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
