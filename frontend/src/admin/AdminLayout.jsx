import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import AdminPanel from './pages/AdminPanel';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '₹';

const AdminLayout = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <div className='admin-panel min-h-screen bg-background text-text font-inter'>
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <div className='flex w-full'>
          <Sidebar token={token} setToken={setToken} />
          <div className='flex-1 overflow-auto'>
            <Routes>
              <Route path='/' element={<AdminPanel token={token} setToken={setToken} />} />
              <Route path='add' element={<Add token={token} />} />
              <Route path='list' element={<List token={token} />} />
              <Route path='orders' element={<Orders token={token} />} />
              <Route path='*' element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
