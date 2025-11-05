import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './pages/Login'
import Payment from './pages/Payment'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Login/> */}
    <Payment/>
  </StrictMode>,
)
