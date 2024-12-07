import './App.css'
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home.jsx'
import Packed from './Packet.jsx'
import { useState } from 'react'
import Fruits from './Fruits.jsx'
import CountObjects from './CountObjects.jsx'

function App() {
  return (
    <>
     <BrowserRouter>
        <Routes>
        
          <Route path='/' element={<Home/>}  />
          
          <Route path='/packet' element={<Packed/>} />
          <Route path='/fruits' element={<Fruits/> }/>
          <Route path='/objects' element={<CountObjects/>} />

        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
