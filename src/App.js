import './css/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './components/SignIn'

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
          <Route path='sign-in' element={<SignIn />} />
          <Route path='chats' element='' />
          <Route path='chats/uid' element='' />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
