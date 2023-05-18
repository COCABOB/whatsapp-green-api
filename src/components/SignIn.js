import { useState, useEffect } from 'react'
import styles from '../css/SignIn.module.css'

export default function SignIn({ handleSignIn, error, isSignedIn }) {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const handleSubmit = e => {
    e.preventDefault()
    const userData = {
      idInstance,
      apiTokenInstance
    }
    handleSignIn(userData)
  }
  return (
    <div className={`row container container-fluid ${styles.container}`}>
      <div
        className={`col-sm-10 col-lg-4 col-md-6 position-absolute top-50 start-50 translate-middle ${styles.signInWrapper}`}
      >
        <div>
          <h1 className={styles.logo}>🟢WhatsGreen</h1>
          <p className={styles.logoDescription}>Chat using GreenAPI</p>
        </div>
        <form className={styles.form} onSubmit={e => handleSubmit(e)}>
          <label className={`form-label ${styles.formLabel}`}>
            ID Instance
          </label>
          <input
            type='text'
            name='idInstance'
            className={`form-control ${styles.formInput}`}
            id='inputIdInstance'
            onChange={e => setIdInstance(e.target.value)}
          />

          <label className={`form-label ${styles.formLabel}`}>
            API Token Instance
          </label>

          <input
            type='password'
            name='apiTokenInstance'
            className={`form-control ${styles.formInput}`}
            id='inputApiTokenInstance'
            onChange={e => setApiTokenInstance(e.target.value)}
          />
          <div className='d-flex align-items-center justify-content-center'>
            <button
              type='submit'
              className={`btn btn-success justify-content-center ${styles.formBtn}`}
            >
              Sign in
            </button>
          </div>
          {isSignedIn ? <h1>✅</h1> : <h1>👺</h1>}
        </form>
        <div className='d-flex align-items-end justify-content-center'>
          {/* {isSignedIn && <p>You are signed in!</p>}
          {error && <p>{error}</p>} */}
          <a
            href='https://console.green-api.com/'
            className={styles.signUp}
            target='__blank'
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  )
}
