import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CandidaAuris from './pages/CandidaAuris';
import Fiebre from './pages/FiebreDelValle';
import Contacto from './pages/Contacto';

const Navbar: React.FC = () => {
  const location = useLocation();
  const getTabClass = (path: string) =>
    `transition-all hover:transform hover:translate-y-[-2px] text-sm font-medium cursor-pointer ${
      location.pathname === path
        ? 'relative text-white font-medium group'
        : 'text-gray-300 hover:text-white'
    }`;

  return (
    <header className="bg-gradient-to-r from-[#0a0e1a] to-[#111527] border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg">
            <i className="fas fa-shield-virus text-blue-400 text-xl"></i>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent cursor-pointer">
            FungiAlert
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={getTabClass('/')}>
            Inicio
          </Link>
          <Link to="/candida" className={getTabClass('/candida')}>
            Candida auris
          </Link>
          <Link to="/fiebre" className={getTabClass('/fiebre')}>
            Fiebre del valle
          </Link>
          <Link to="/contacto" className={getTabClass('/contacto')}>
            Contacto
            {location.pathname === '/contacto' && (
              <span className="absolute bottom-[-8px] left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/candida" element={<CandidaAuris />} />
          <Route path="/fiebre" element={<Fiebre />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
