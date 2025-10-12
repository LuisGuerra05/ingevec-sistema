import React, { useEffect, useRef, useState } from "react";
import { Navbar, Nav, Container, Modal, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PersonCircle } from "react-bootstrap-icons"; // ícono bootstrap
import "./Navbar.css";

function AppNavbar() {
  const [show, setShow] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false); // 🔹 estado para el modal
  const lastScroll = useRef(window.scrollY);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Mostrar / ocultar navbar según scroll
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current < lastScroll.current || current < 10) setShow(true);
      else setShow(false);
      lastScroll.current = current;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar collapse cuando cambia la ruta
  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  const handleNavClick = () => setExpanded(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
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
          {/* Logo */}
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
                to="/"
                active={location.pathname === "/"}
                onClick={handleNavClick}
                className="py-2"
              >
                Inicio
              </Nav.Link>

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

            {/* Ícono de perfil */}
            <div
              onClick={() => setShowModal(true)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              title="Ver perfil"
            >
              <PersonCircle size={34} color="#333" />
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* MODAL DE PERFIL */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="text-center"
      >
        <Modal.Body className="p-4">
          {/* Logo más pequeño y discreto */}
          <img
            src="/logo_ingevec.svg"
            alt="Ingevec Logo"
            style={{ width: 110, height: "auto", marginBottom: 10 }}
          />

          <h5 className="mb-2 fw-semibold">Sesión activa</h5>

          <p className="text-muted mb-1" style={{ fontSize: "0.95rem" }}>
            <strong>{user.email}</strong>
          </p>

          <p className="text-secondary" style={{ fontSize: "0.85rem" }}>
            Último acceso: {new Date().toLocaleDateString("es-CL")}{" "}
            {new Date().toLocaleTimeString("es-CL", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <div className="d-grid gap-2 mt-3">
            <Button
              variant="secondary"
              onClick={handleLogout}
              style={{ borderRadius: 10 }}
            >
              Cerrar sesión
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AppNavbar;
