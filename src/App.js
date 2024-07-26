import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaChartLine, FaNewspaper, FaGlobe } from "react-icons/fa";

import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Newsroom from "./pages/Newsroom";
import MarketOverview from "./pages/MarketOverview";

const NavButton = ({ to, icon, children }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link
      to={to}
      className="flex items-center px-4 py-2 text-text-primary hover:bg-primary hover:text-background rounded transition duration-200"
    >
      {icon}
      <span className="ml-2">{children}</span>
    </Link>
  </motion.div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-text-primary">
        <nav className="p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-primary text-2xl font-bold">Intellivest</h1>
            <div className="flex space-x-4">
              <NavButton to="/" icon={<FaHome className="text-secondary" />}>
                Home
              </NavButton>
              <NavButton
                to="/portfolio"
                icon={<FaChartLine className="text-secondary" />}
              >
                Portfolio
              </NavButton>
              <NavButton
                to="/newsroom"
                icon={<FaNewspaper className="text-secondary" />}
              >
                Newsroom
              </NavButton>
              <NavButton
                to="/market"
                icon={<FaGlobe className="text-secondary" />}
              >
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
