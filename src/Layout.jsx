import React from 'react'
import Header from './components/Header.jsx'
import { Outlet } from 'react-router-dom'
import Footer from './components/FooterComp.jsx'

const Layout = () => {
  return (
    <>
    <Header />
    <Outlet />
    <Footer />
    </>
  )
}

export default Layout