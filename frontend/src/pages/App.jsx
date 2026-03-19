import { useState } from 'react'
import '../styles/App.css'
import { Routes, Route, BrowserRouter, useLocation, useNavigate, Navigate } from 'react-router-dom'

function AppContent() {
  return (
    <>
      {/* <Header/> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error />} />
      </Routes>
      {/* <Footer/> */}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
