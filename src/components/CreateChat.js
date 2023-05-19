import styles from '../css/CreateChat.module.css'
import { useState } from 'react'

export default function CreateChat({
  existsWhatsapp,
  handleCreateChat,
  handleCheckNumber
}) {
  const inputChange = e => {
    handleCheckNumber(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    handleCheckNumber(e.target.value)
    handleCreateChat(existsWhatsapp)
  }
  return (
    <div className={`row container container-fluid ${styles.container}`}>
      <div
        className={`col-sm-10 col-lg-4 col-md-6 position-absolute top-50 start-50 translate-middle ${styles.signInWrapper}`}
      >
        <p className={styles.formDescription}>
          Enter phone number you wish to contact
        </p>

        <form className={styles.form} onSubmit={e => handleSubmit(e)}>
          <label className={`form-label ${styles.formLabel}`}>
            Phone Number📞
          </label>

          <input
            type='tel'
            name='phoneNumber'
            className={`form-control ${styles.formInput}`}
            id='inputPhoneNumber'
            // onChange={e => setPhoneNumber(e.target.value)}
            onChange={e => inputChange(e)}
          />
          <div className='d-flex align-items-center justify-content-center'>
            <p className={styles.phoneExist}>
              {existsWhatsapp
                ? 'This number exists✅'
                : 'This number does not exist❌'}
            </p>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            <button
              type='submit'
              className={`btn btn-success justify-content-center ${styles.formBtn}`}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
