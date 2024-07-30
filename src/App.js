import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
        className="absolute inset-0 bg-button-primary opacity-0 group-hover:opacity-100 rounded transition-opacity duration-200"
        layoutId="bubble"
      />
      <span className="relative z-10 flex items-center">
        {React.cloneElement(icon, {
          className:
            "text-primary group-hover:text-background transition duration-200",
        })}
        <span className="ml-2">{children}</span>
      </span>
    </Link>
  </motion.div>
);

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-text-primary">
        <header className="fixed top-0 left-0 right-0 z-50">
          <nav className="bg-background bg-opacity-80 backdrop-filter backdrop-blur-lg p-4 shadow-md">
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
        </header>

        <main className="container mx-auto mt-24 p-4">
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <motion.div
                    key="home"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Home />
                  </motion.div>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <motion.div
                    key="portfolio"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Portfolio />
                  </motion.div>
                }
              />
              <Route
                path="/newsroom"
                element={
                  <motion.div
                    key="newsroom"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Newsroom />
                  </motion.div>
                }
              />
              <Route
                path="/market"
                element={
                  <motion.div
                    key="market"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <MarketOverview />
                  </motion.div>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;
