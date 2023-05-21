import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import whatsAppClient from '@green-api/whatsapp-api-client'

import styles from '../css/Chat.module.css'
import Message from './Message'

export default function Chat({ phoneNumber, userData }) {
  // textMessage нужен для отслеживания текста в input
  const [textMessage, setTextMessage] = useState('')
  // displayMessages - массив всех сообщений, которые должны выводится в приложении
  const [displayMessages, setDisplayMessages] = useState([])
  // isSent задается true когда пользователь отправляет сообщение, после успешной отправки ему присвается false, чтобы useEffect лишний раз не вызывался
  const [isSent, setIsSent] = useState(false)

  // newSentMessage нужен чтобы быстро передать текст в API запрос на отправку
  const [newSentMessage, setNewSentMessage] = useState([])

  // oldReceivedMessage и newReceivedMessage будут сравниваться, чтобы проверить не получил ли API несколько одинаковых уведомлений
  const [oldReceivedMessage, setOldReceivedMessage] = useState([])
  const [newReceivedMessage, setNewReceivedMessage] = useState([])

  // Хук для отправки сообщений
  useEffect(() => {
    ;(async function () {
      // Проверяем засабмиттил ли пользователь сообщение (isSent) и не пустое ли это сообщение
      if (isSent && !!newSentMessage) {
        try {
          // Уточняем запрос, передаем номер адресанта и текст отправленного сообщения
          const request = {
            method: 'POST',
            body: JSON.stringify({
              chatId: `${phoneNumber.substring(1)}@c.us`,
              message: `${newSentMessage.text}`
            })
          }
          await fetch(
            `https://api.green-api.com/waInstance${userData.idInstance}/SendMessage/${userData.apiTokenInstance}`,
            request
          )
          console.log(`Message sent successfully`)
        } catch (e) {
          console.log(e.message)
        } finally {
          // Ставим false чтобы хук не вызывался лишний раз и ждал когда пользователь отправит сообщение
          setIsSent(false)
        }
      }
    })()
  }, [
    userData.idInstance,
    userData.apiTokenInstance,
    phoneNumber,
    isSent,
    newSentMessage
  ])

  // Ловим входящие уведомления
  useEffect(() => {
    ;(async () => {
      // Достаем ID и токен и передаем их Green API
      let restAPI = whatsAppClient.restAPI({
        idInstance: userData.idInstance,
        apiTokenInstance: userData.apiTokenInstance
      })
      try {
        // Отправляем запрос на получение уведомлений, обрабатываем их
        await restAPI.webhookService.startReceivingNotifications()
        restAPI.webhookService.onReceivingMessageText(body => {
          // Передаем новое сообщение в useState для будущей проверки на уникальность
          setNewReceivedMessage({
            text: body.messageData.textMessageData.textMessage,
            isSent: false,
            id: uuidv4()
          })
          // Закрываем получение уведомлений
          restAPI.webhookService.stopReceivingNotifications()
        })
      } catch (ex) {
        console.error(ex)
      }
    })()
  }, [userData, displayMessages])

  // Добавление отправленных сообщений при сабмите
  const handleSendMessage = messageText => {
    const newMessage = {
      text: messageText,
      isSent: true,
      id: uuidv4()
    }
    setDisplayMessages([...displayMessages, newMessage])

    // newSentMessage нужен чтобы оперативно достать текст
    // из submitted сообщения и передать этот текст в API запрос на отправку
    setNewSentMessage(newMessage)
    // setIsSent нужен чтобы вызывать useEffect только когда пользователь засабмитил сообщение
    setIsSent(true)
  }
  const handleSubmit = e => {
    e.preventDefault()
    handleSendMessage(textMessage)
    setTextMessage('')
  }
  const handleInputChange = text => {
    setTextMessage(text)
  }

  // иногда API несколько раз отправляет одинаковые сообщения с идентичным messageId,
  // поэтому проверяем их с помощью уникального uuidv4, и тексту
  if (
    newReceivedMessage.text !== oldReceivedMessage.text &&
    newReceivedMessage.id !== oldReceivedMessage.id
  ) {
    setDisplayMessages([...displayMessages, newReceivedMessage])
    setOldReceivedMessage(newReceivedMessage)
  }

  return (
    <div className={`row container container-fluid ${styles.container}`}>
      <div
        className={`col-sm-10 col-lg-4 col-md-6 position-absolute top-50 start-50 translate-middle  ${styles.chatWrapper}`}
      >
        <div className={styles.header}>
          <h3>{phoneNumber}</h3>
        </div>

        <div className={styles.chatField}>
          <div className='d-flex align-items-center justify-content-center'></div>
          {displayMessages.map(message => (
            <Message {...message} key={message.id} />
          ))}
        </div>

        <form className={styles.form} onSubmit={e => handleSubmit(e)}>
          <div className='d-flex align-items-center justify-content-center'>
            <input
              type='text'
              value={textMessage}
              name='textMessage'
              placeholder='Type a message'
              className={`form-control ${styles.formInput}`}
              id='inputTextMessage'
              // onChange={e => setTextMessage(e.target.value)}
              onInput={e => handleInputChange(e.target.value)}
            />
            <button
              type='submit'
              disabled={!!!textMessage ? true : false}
              className={`btn btn-success justify-content-center ${styles.formBtn}`}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
