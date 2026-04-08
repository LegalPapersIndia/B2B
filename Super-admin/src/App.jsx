import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Companies from './components/Companies';
import Products from './components/Products';
import Enquiries from './components/Enquiries';
import Categories from './components/Categories';   // ← New

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsLoggedIn(!!token);
  }, []);

  if (isLoggedIn === null) return null;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/companies" element={isLoggedIn ? <Companies /> : <Navigate to="/login" />} />
        <Route path="/products" element={isLoggedIn ? <Products /> : <Navigate to="/login" />} />
        <Route path="/categories" element={isLoggedIn ? <Categories /> : <Navigate to="/login" />} />
        <Route path="/enquiries" element={isLoggedIn ? <Enquiries /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/companies" />} />
      </Routes>
    </Router>
  );
}