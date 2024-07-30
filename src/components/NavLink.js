import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavLink = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 text-sm font-medium transition duration-150 ease-in-out border-b-2 ${
        isActive
          ? "text-primary border-primary"
          : "text-text-secondary hover:text-primary border-transparent hover:border-primary"
      }`}
    >
      {React.cloneElement(icon, {
        className: `mr-1.5 h-5 w-5 ${
          isActive
            ? "text-primary"
            : "text-text-secondary group-hover:text-primary"
        }`,
      })}
      {children}
    </Link>
  );
};

export default NavLink;
