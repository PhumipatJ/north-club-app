import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from './components/navbar';
import Home from './components/sections/Home'
import Login from './components/sections/Login'
import Register from './components/sections/Register'
import Clublist from './components/sections/Clublist'
import Clubfile from './components/sections/Clubfile';
import Clubpage from './components/sections/Clubpage';
import Clubmember from './components/sections/Clubmember';
import Statpage from './components/sections/Statpage';
import Wrapper from './components/sections/Wrapper';
import Footer from './components/Footer';
import ClubApplication from './components/sections/ClubApplication';
import AdminApprove from './components/sections/AdminApprove';
import AdminRespond from './components/sections/AdminRespond';
import ApprovalHistory from './components/sections/ApprovalHistory';
import ApprovalDetail from './components/sections/ApprovalDetail';

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<><Home /><Footer /></>} />
          <Route path="/login" element={<><Login /><Footer /></>} />
          <Route path="/register" element={<><Register /><Footer /></>} />
          <Route path="/clubs" element={<><Clublist /><Footer /></>} />
          <Route path="/clubs/:clubname" element={<><Clubpage /><Footer /></>} />
          <Route path="/clubs/:clubname/members" element={<><Clubmember/><Footer /></>} />
          <Route path="/stats" element={<><Statpage /><Footer /></>} />
          <Route path="/clubApplication" element={<Wrapper allowedRoles={['student', 'club', 'admin']} ><ClubApplication /><Footer /></Wrapper>} />
          <Route path="/docs" element={<><Clubfile /><Footer /></>} />
          <Route path="/database" element={<Wrapper allowedRoles={['admin']} ><AdminApprove /></Wrapper>} />
          <Route path="/adminRespond" element={<Wrapper allowedRoles={['admin']} ><AdminRespond /><Footer /></Wrapper>} />
          <Route path="/approvalHistory" element={<Wrapper allowedRoles={['admin']} ><ApprovalHistory /><Footer /></Wrapper>} />
          <Route path="/approvalDetail/:clubId" element={<Wrapper allowedRoles={['admin']} ><ApprovalDetail /><Footer /></Wrapper>} />
        </Routes>
        
      </Router>
    </>
  )
}

export default App
