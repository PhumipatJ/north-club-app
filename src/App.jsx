import { useState } from 'react'
import './App.css'
import Auth from './components/Auth';
import Account from './components/Account';
import Navbar from './components/navbar';
import Home from './components/sections/Home'

function App() {

  return (
    <>
      <Navbar />
      <Home />
    </>
  )
}

export default App
