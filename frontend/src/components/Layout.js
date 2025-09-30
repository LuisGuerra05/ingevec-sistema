import React from "react";
import AppNavbar from "./Navbar";
import "./Navbar.css";
import "./Layout.css";

function Layout({ children }) {
  return (
    <>
      <AppNavbar />
      <div className="layout-bg">
        <div className="page-container">
          <div className="page-content">{children}</div>
        </div>
      </div>
    </>
  );
}

export default Layout;