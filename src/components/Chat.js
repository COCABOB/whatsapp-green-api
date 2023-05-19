import styles from '../css/Chat.module.css'
import { useState } from 'react'
import Message from './Message'

export default function Chat({
  handleSendMessage,
  handleReceiveMessage,
  messages,
  phoneNumber
}) {
  const [textMessage, setTextMessage] = useState()
  const handleSubmit = e => {
    e.preventDefault()
    handleSendMessage(textMessage)
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
          {console.log(messages)}
          {messages.map(message => (
            <Message {...message} key={message.id} />
          ))}
        </div>

        <form className={styles.form} onSubmit={e => handleSubmit(e)}>
          <div className='d-flex align-items-center justify-content-center'>
            <input
              type='text'
              name='textMessage'
              placeholder='Type a message'
              className={`form-control ${styles.formInput}`}
              id='inputTextMessage'
              // onChange={e => setPhoneNumber(e.target.value)}
              onChange={e => setTextMessage(e.target.value)}
            />
            <button
              type='submit'
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
