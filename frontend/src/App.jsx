import './App.css'
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home.jsx'
import Packed from './Packet.jsx'
import Fruits from './Fruits.jsx'
import FileUpload from './FileUpload.jsx'
import Nav from './Nav.jsx'


function App() {
  return (
    <>
     <BrowserRouter>
     <Nav/>
        <Routes>
        
          <Route path='/' element={<Home/>}  />
          
          <Route path='/packed' element={<Packed/>} />
          <Route path='/fruits' element={<Fruits/> }/>
          <Route path='/upload' element={<FileUpload/>} />

        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
