// import { useState } from 'react'
import './App.css'

import {Routes,Route} from 'react-router-dom'
import Login from './components/Login/Login'
import Signup from './components/Signup/Signup'
import Landing from './components/Landing/Landing'
import OTPValidation from './components/OTP/OTPValidation'
import {Toaster} from 'react-hot-toast'

import HomeProtectionAccountant from './components/HomeProtection/HomeProtectionAccountant'
import HomeProtectionStudent from './components/HomeProtection/HomeProtectionStudent'
import HomeAccountant from './components/Home/HomeAccountant'
import StudentHomePage from './components/Home/StudentHomePage'
import PurchaseExtras from './components/PurchaseExtras/PurchaseExtras'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/otp-validation' element={<OTPValidation />} />
        <Route path='/st-home' element={
          
            <StudentHomePage />
          
        }/>
        <Route path='/acc-home' element={
          
            <HomeAccountant />
          
        }/>
        <Route path='/purchase' element={
          <PurchaseExtras />
        }></Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
