import React from 'react'
import Sidebar from './components/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Add from './pages/Add'
import Orders from './pages/Orders'
import List from './pages/List'
import { useState, useEffect } from 'react'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminPanel from './pages/AdminPanel'
import Customizations from './pages/customizations'

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '₹'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <div className='min-h-screen bg-white'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <div className='flex w-full'>
            <Sidebar token={token} setToken={setToken} />
            <div className='flex-1 overflow-auto'>
              <Routes>
                <Route path='/' element={<AdminPanel token={token} setToken={setToken} />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/customizations' element={<Customizations token={token} />} />
                <Route path='*' element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App;