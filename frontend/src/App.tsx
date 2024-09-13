import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home/Home'
import Notify from './Notify/Notify'
import History from './History/History'
import ProfileEdit from './ProfileEdit/ProfileEdit'

import './App.css'

const App: React.FC = () => {
  return (
    <div>
      

      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Notify" element={<Notify />} />
        <Route path="/History" element={<History />} />
        <Route path="/ProfileEdit" element={<ProfileEdit />} />
        {/* Add more routes here as you create more pages */}
      </Routes>
    </div>
  )
}

export default App