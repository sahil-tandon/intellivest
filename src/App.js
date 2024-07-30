import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaChartLine, FaNewspaper, FaGlobe } from "react-icons/fa";
import NavLink from "./components/NavLink";

import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Newsroom from "./pages/Newsroom";
import MarketOverview from "./pages/MarketOverview";

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
      <div className="min-h-screen bg-background text-text-primary font-inter">
        <header className="fixed top-0 left-0 right-0 z-50">
          <nav className="bg-background bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <motion.h1
                      className="text-primary text-xl font-bold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Intellivest
                    </motion.h1>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <NavLink to="/" icon={<FaHome />}>
                      Home
                    </NavLink>
                    <NavLink to="/portfolio" icon={<FaChartLine />}>
                      Portfolio
                    </NavLink>
                    <NavLink to="/newsroom" icon={<FaNewspaper />}>
                      Newsroom
                    </NavLink>
                    <NavLink to="/market" icon={<FaGlobe />}>
                      Market
                    </NavLink>
                  </div>
                </div>
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
