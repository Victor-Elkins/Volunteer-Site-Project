import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home/Home'
import Login from './Login/Login'
import Registration from './Registration/Registration'
import Notify from './Notify/Notify'
import History from './History/History'
import ProfileEdit from './ProfileEdit/ProfileEdit'
import Event from './Event Managing Form/Event Managing Form'
import VolunteerMatching from './Volunteer Matching Form/Volunteer Matching Form'
import ProtectedRoute from './Components/ProtectedRoute'

import './App.css'

const App: React.FC = () => {
  return (
    <div>
      

      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registration" element={<Registration />} />
        {/* Protected routes */}
        <Route path="/Home" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        } />
        <Route path="/Notify" element={
          <ProtectedRoute><Notify /></ProtectedRoute>
        } />
        <Route path="/History" element={
          <ProtectedRoute><History /></ProtectedRoute>
        } />
        <Route path="/ProfileEdit" element={
          <ProtectedRoute><ProfileEdit /></ProtectedRoute>
        } />
        <Route path="/Event-Managing-Form" element={
          <ProtectedRoute><Event /></ProtectedRoute>
        } />
        <Route path="/Volunteer-Matching-Form" element={
          <ProtectedRoute><VolunteerMatching /></ProtectedRoute>
        } />
        {/* Add more routes here as you create more pages */}
      </Routes>
    </div>
  )
}

export default App