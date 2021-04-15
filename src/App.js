import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Webroute from './Webroute'
import Header from './Header'
import Footer from './Footer'
import {BrowserRouter} from 'react-router-dom';


function App () {
  return (
    <BrowserRouter>
      
      <Webroute />
     
      </BrowserRouter>
  )
}

export default App
