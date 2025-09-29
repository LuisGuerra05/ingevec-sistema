import React from "react";
import AppNavbar from "./Navbar";
import "./Navbar.css";

function Layout({ children }) {
  return (
    <div className="page-container">
      <AppNavbar />
      <div className="page-content">{children}</div>
    </div>
  );
}

export default Layout;