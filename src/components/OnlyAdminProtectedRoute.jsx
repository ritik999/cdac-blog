import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const OnlyAdminProtectedRoute = () => {
    const {currentUser}=useSelector(state=>state.userData);
  return currentUser && currentUser.role=='admin' ? <Outlet /> : <Navigate to='/sign-in'/>
    
}

export default OnlyAdminProtectedRoute;