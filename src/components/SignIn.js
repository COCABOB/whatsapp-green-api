import styles from '../css/SignIn.module.css'

export default function SignIn() {
  return (
    <div className={`row container container-fluid ${styles.container}`}>
      <div
        className={`col-sm-10 col-lg-4 col-md-6 position-absolute top-50 start-50 translate-middle ${styles.signInWrapper}`}
      >
        <div>
          <h1 className={styles.logo}>🟢WhatsGreen</h1>
          <p className={styles.logoDescription}>Chat using GreenAPI</p>
        </div>
        <form className={styles.form}>
          <label className={`form-label ${styles.formLabel}`}>
            ID Instance
          </label>
          <input
            type='text'
            name='idInstance'
            className={`form-control ${styles.formInput}`}
            id='inputIdInstance'
          />

          <label className={`form-label ${styles.formLabel}`}>
            API Token Instance
          </label>

          <input
            type='password'
            name='apiTokenInstance'
            className={`form-control ${styles.formInput}`}
            id='inputIdInstance'
          />
          <div className='d-flex align-items-center justify-content-center'>
            <button
              type='submit'
              className={`btn btn-success justify-content-center ${styles.formBtn}`}
            >
              Sign in
            </button>
          </div>
        </form>
        <div className='d-flex align-items-end justify-content-center'>
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
