import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const mockUsers = [
    {
      email: process.env.REACT_APP_ADMIN_EMAIL,
      password: process.env.REACT_APP_ADMIN_PASSWORD,
      role: 'admin',
    },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = mockUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', foundUser.role);
      localStorage.setItem('email', foundUser.email);
      navigate('/dashboard');
    } else {
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <div style={{ backgroundColor: '#f7f9fc', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container className="d-flex justify-content-center">
        <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow p-4">
          <div className="text-center mb-4">
            {/* Cambia el src cuando tengas el logo de Ingevec */}
            <img src="/logo_ingevec.svg" alt="Ingevec Logo" style={{ width: 170 }} />
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
                placeholder="ejemplo@ingevec.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
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
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Iniciar Sesión
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

export default Login;