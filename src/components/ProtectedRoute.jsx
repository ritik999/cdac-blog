import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const {currentUser}=useSelector(state=>state.userData);
    console.log(currentUser);
  return currentUser ? <Outlet /> : <Navigate to='/sign-in'/>
    
}

export default ProtectedRoute;