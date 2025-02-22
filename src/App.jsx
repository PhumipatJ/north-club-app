import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from './components/navbar';
import Home from './components/sections/Home'
import Login from './components/sections/Login'
import Register from './components/sections/Register'
import Clublist from './components/sections/Clublist'
import Clubfile from './components/sections/Clubfile';
import Wrapper from './components/sections/Wrapper';
import Footer from './components/Footer';
import CreateClub from './components/sections/createClub';

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/clubs" element={<Clublist />} />
          <Route path="/createClub" element={<Wrapper allowedRoles={['student', 'club', 'admin']} ><CreateClub /></Wrapper>} />
          <Route path="/docs" element={<Clubfile />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
