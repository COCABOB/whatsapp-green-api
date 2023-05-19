import styles from '../css/Message.module.css'

export default function Message(message) {
  return (
    <>
      {' '}
      {message.isSent ? (
        <p className={`message ${styles.messageSent}`}>{message.text}</p>
      ) : (
        <p className={`message ${styles.messageReceived}`}>{message.text}</p>
      )}
    </>
  )
}
