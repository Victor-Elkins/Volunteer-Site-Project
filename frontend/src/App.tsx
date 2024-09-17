import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home/Home'
import Login from './Login/Login'
import Registration from './Registration/Registration'
import Notify from './Notify/Notify'
import History from './History/History'
import ProfileEdit from './ProfileEdit/ProfileEdit'
import Event from './Event Managing Form/Event Managing Form'

import './App.css'
import VolunteerMatching from './Volunteer Matching Form/Volunteer Matching Form'

const App: React.FC = () => {
  return (
    <div>
      

      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/Notify" element={<Notify />} />
        <Route path="/History" element={<History />} />
        <Route path="/ProfileEdit" element={<ProfileEdit />} />
        <Route path="/Event-Managing-Form" element={<Event />} />
        <Route path="/Volunteer-Matching-Form" element={<VolunteerMatching />} />
        {/* Add more routes here as you create more pages */}
      </Routes>
    </div>
  )
}

export default App