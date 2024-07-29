import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaChartLine, FaNewspaper, FaGlobe } from "react-icons/fa";

import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Newsroom from "./pages/Newsroom";
import MarketOverview from "./pages/MarketOverview";

const NavButton = ({ to, icon, children }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative"
  >
    <Link
      to={to}
      className="flex items-center px-4 py-2 text-text-primary hover:text-background rounded transition duration-200 group"
    >
      <motion.div
        className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 rounded transition-opacity duration-200"
        layoutId="bubble"
      />
      <span className="relative z-10 flex items-center">
        {React.cloneElement(icon, {
          className:
            "text-secondary group-hover:text-background transition duration-200",
        })}
        <span className="ml-2">{children}</span>
      </span>
    </Link>
  </motion.div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-background to-card text-text-primary">
        <nav className="bg-card bg-opacity-80 backdrop-filter backdrop-blur-lg p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <motion.h1
              className="text-primary text-2xl font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Intellivest
            </motion.h1>
            <div className="flex space-x-4">
              <NavButton to="/" icon={<FaHome />}>
                Home
              </NavButton>
              <NavButton to="/portfolio" icon={<FaChartLine />}>
                Portfolio
              </NavButton>
              <NavButton to="/newsroom" icon={<FaNewspaper />}>
                Newsroom
              </NavButton>
              <NavButton to="/market" icon={<FaGlobe />}>
                Market
              </NavButton>
            </div>
          </div>
        </nav>

        <main className="container mx-auto mt-8 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/newsroom" element={<Newsroom />} />
            <Route path="/market" element={<MarketOverview />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
