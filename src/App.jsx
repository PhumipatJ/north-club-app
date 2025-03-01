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
import ClubManage from './components/sections/ClubManage';
import Statpage from './components/sections/Statpage';
import UserProfile from './components/sections/UserProfile';
import Wrapper from './components/sections/Wrapper';
import Footer from './components/Footer';
import ClubApplication from './components/sections/ClubApplication';
import AdminApprove from './components/sections/AdminApprove';
import AdminRespond from './components/sections/AdminRespond';
import ApprovalHistory from './components/sections/ApprovalHistory';
import Clubprofile from './components/sections/Clubprofile';
import ActivityDetail from './components/sections/ActivityDetail';
import AdminUserPreview from './components/sections/AdminUserPreview';
import AdminLog from './components/sections/AdminLog';
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
          <Route path="/clubs/:clubId" element={<><Clubpage /><Footer /></>} />
          <Route path="/clubmember/:clubId" element={<><Clubmember/><Footer /></>} />
          <Route path="/stats" element={<><Statpage /><Footer /></>} />
          <Route path="/clubApplication" element={<Wrapper allowedRoles={['student', 'club', 'admin']} ><ClubApplication /><Footer /></Wrapper>} />
          <Route path="/clubmanage/:clubId" element={<Wrapper allowedRoles={['club']} ><ClubManage /><Footer /></Wrapper>} />
          <Route path="/docs" element={<><Clubfile /><Footer /></>} />
          <Route path="/database" element={<Wrapper allowedRoles={['admin']} ><AdminApprove /></Wrapper>} />
          <Route path="/database/adminRespond" element={<Wrapper allowedRoles={['admin']} ><AdminRespond /></Wrapper>} />
          <Route path="/database/approvalHistory" element={<Wrapper allowedRoles={['admin']} ><ApprovalHistory /></Wrapper>} />
          <Route path="/userprofile" element={<Wrapper allowedRoles={['student','club','admin']}><UserProfile /><Footer /></Wrapper>} />
          <Route path="/Clubprofile/:clubId" element={<Wrapper allowedRoles={['student','club','admin']}><Clubprofile /><Footer /></Wrapper>} />
          <Route path="/activityDetail" element={<><ActivityDetail /><Footer /></>} />
          <Route path="/database/adminUserPreview" element={<Wrapper allowedRoles={['admin']} ><AdminUserPreview /></Wrapper>} />
          <Route path="/database/adminLog" element={<Wrapper allowedRoles={['admin']} ><AdminLog /></Wrapper>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
