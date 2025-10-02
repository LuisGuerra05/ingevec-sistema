import React, { useEffect, useRef, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function AppNavbar() {
  const [show, setShow] = useState(true);         // mostrar/ocultar al hacer scroll
  const [expanded, setExpanded] = useState(false); // controla el collapse en móvil
  const lastScroll = useRef(window.scrollY);
  const location = useLocation();

  // Oculta/mostrar navbar según scroll
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

  // Cierra el collapse al cambiar de ruta (ej: back/forward)
  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  // helper para cerrar al clickear un link
  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar
      expand="lg"
      className={`navbar shadow-sm ${show ? "navbar-show" : "navbar-hide"}`}
      bg="white"
      variant="light"
      expanded={expanded}
      onToggle={(next) => setExpanded(next)}
      fixed="top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={handleNavClick}>
          <img
            src="/logo_ingevec.svg"
            alt="Ingevec Logo"
            height="40"
            style={{ marginRight: 12 }}
          />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="main-navbar"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
        />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/buscar-empresa"
              active={location.pathname === "/buscar-empresa"}
              onClick={handleNavClick}
              className="py-2"
            >
              Buscar Subcontratista
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/clasificacion"
              active={location.pathname === "/clasificacion"}
              onClick={handleNavClick}
              className="py-2"
            >
              Clasificación
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/ingresar-datos"
              active={location.pathname === "/ingresar-datos"}
              onClick={handleNavClick}
              className="py-2"
            >
              Ingresar Datos
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
