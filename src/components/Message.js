import styles from '../css/Message.module.css'

export default function Message(message) {
  // если isSent = true, кидаем сообщение вправо, false - влево
  return (
    <>
      {message.isSent ? (
        <div className='d-flex'>
          <p className={`message ${styles.messageSent}`}>{message.text}</p>
        </div>
      ) : (
        <div className='d-flex'>
          <p className={`message ${styles.messageReceived}`}>{message.text}</p>
        </div>
      )}
    </>
  )
}
