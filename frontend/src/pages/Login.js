import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validar solo correos @ingevec.cl
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@ingevec\.cl$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Solo se permiten correos @ingevec.cl');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log('Respuesta login:', data); // <-- AGREGA ESTE LOG
      setLoading(false);
      if (data.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.error || 'Email o contraseña incorrectos');
      }
    } catch (err) {
      setLoading(false);
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f7f9fc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container className="d-flex justify-content-center">
        <Card
          style={{ width: '100%', maxWidth: '400px' }}
          className="shadow p-4"
        >
          <div className="text-center mb-4">
            <img
              src="/logo_ingevec.svg"
              alt="Ingevec Logo"
              style={{ width: 170 }}
            />
            <h4 className="mt-3">Bienvenido a Ingevec</h4>
            <p className="text-muted mb-0">Inicia sesión para continuar</p>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                id="email"
                placeholder="usuario@ingeveg.cl"
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
            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

export default Login;