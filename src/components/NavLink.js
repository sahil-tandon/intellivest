import React, { useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NavLink = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const linkRef = useRef(null);

  useEffect(() => {
    const handleMouseDown = () => {
      linkRef.current.style.outline = "none";
    };

    const handleKeyUp = (e) => {
      if (e.key === "Tab") {
        linkRef.current.style.outline = "";
      }
    };

    const link = linkRef.current;
    link.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      link.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <Link
      ref={linkRef}
      to={to}
      className={`group flex items-center px-3 py-2 text-sm font-medium transition duration-150 ease-in-out
        ${isActive ? "text-primary" : "text-text-secondary"}
        hover:text-primary focus-visible:text-primary
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-50`}
    >
      {React.cloneElement(icon, {
        className: `mr-1.5 h-5 w-5 transition-colors duration-150 ease-in-out
          ${isActive ? "text-primary" : "text-text-secondary"}
          group-hover:text-primary group-focus-visible:text-primary`,
      })}
      {children}
    </Link>
  );
};

export default NavLink;
