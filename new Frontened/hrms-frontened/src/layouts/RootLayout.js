import React from 'react'
import Sidebar from '../component/User/SideBar/SideBar'
import { Outlet } from 'react-router-dom'
import ProtectedRoute from '../utils/ProtectedRoute'
const RootLayout = () => {
  return (
    <div>
    <ProtectedRoute allowedRoles={['user', 'admin']}>
      <Sidebar />
      <main style={{backgroundColor: "#E2E7F0"}}>
        <Outlet />
      </main>
    </ProtectedRoute>
    </div>
   

  )
}

export default RootLayout