// frontend/src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import "./Login.css";
import { login as loginApi } from "../api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validar solo correos @ingevec.cl
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@ingevec\.cl$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Solo se permiten correos @ingevec.cl");
      return;
    }

    setLoading(true);
    try {
      const data = await loginApi(email, password);
      setLoading(false);

      if (data.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        setError(data.error || "Email o contraseña incorrectos");
      }
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.error || "Error de conexión con el servidor");
    }
  };

  return (
    <div
      className="login-bg"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${process.env.PUBLIC_URL}/fondo.jpg)`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Container className="d-flex justify-content-center">
        <Card className="shadow p-4 login-card">
          <div className="text-center mb-4">
            <img src="/logo_ingevec.svg" alt="Ingevec Logo" style={{ width: 170 }} />
            <h4 className="mt-3">Bienvenido al Radar de Riesgo de Subcontratos</h4>
            <p className="text-muted mb-0">Inicia sesión para continuar</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                id="email"
                placeholder="usuario@ingevec.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                isInvalid={!!error && !validateEmail(email)}
              />
              <Form.Control.Feedback type="invalid">
                Solo se permiten correos @ingevec.cl
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                isInvalid={!!error && password.length < 6}
              />
              <Form.Control.Feedback type="invalid">
                La contraseña debe tener al menos 6 caracteres
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

export default Login;
