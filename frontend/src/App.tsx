import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home/Home'
import Login from './Login/Login'
import Registration from './Registration/Registration'
import './App.css'

const App: React.FC = () => {
  return (
    <div>
      

      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registration" element={<Registration />} />
        {/* Add more routes here as you create more pages */}
      </Routes>
    </div>
  )
}

export default App