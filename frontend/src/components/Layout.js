import React from "react";
import AppNavbar from "./Navbar";
import Footer from "./Footer";
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
        <Footer />
      </div>
    </>
  );
}

export default Layout;