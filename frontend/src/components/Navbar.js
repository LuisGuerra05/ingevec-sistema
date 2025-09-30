import React, { useEffect, useRef, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function AppNavbar() {
  const [show, setShow] = useState(true);
  const lastScroll = useRef(window.scrollY);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current < lastScroll.current || current < 10) {
        setShow(true);
      } else {
        setShow(false);
      }
      lastScroll.current = current;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar
      expand="lg"
      className={`navbar shadow-sm ${show ? "navbar-show" : "navbar-hide"}`}
      bg="white"
      variant="light"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/logo_ingevec.svg"
            alt="Ingevec Logo"
            height="40"
            style={{ marginRight: 12 }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/buscar-empresa" active={location.pathname === "/buscar-empresa"}>
              Buscar Subcontratista
            </Nav.Link>
            <Nav.Link as={Link} to="/clasificacion" active={location.pathname === "/clasificacion"}>
              Clasificación
            </Nav.Link>
            <Nav.Link as={Link} to="/ingresar-datos" active={location.pathname === "/ingresar-datos"}>
              Ingresar Datos
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;