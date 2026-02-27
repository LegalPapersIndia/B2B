// src/App.jsx
import React from 'react';
import Navbar from './Component/Navbar';
import Home from './Pages/Home';
import Footer from './Component/Footer';
import './App.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 antialiased">
      <Navbar />
      <main className="flex-1">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;