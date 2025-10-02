// frontend/src/pages/Home.js
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="login-bg">
      <Container className="d-flex justify-content-center">
        <Card className="login-card shadow p-4 text-center">
          <img src="/logo_ingevec.svg" alt="Ingevec Logo" style={{ width: 170, height: 'auto', marginBottom: 16 }} />
          <h2>Dashboard Ingevec</h2>
          <p>Bienvenido, <b>{user.email}</b></p>
          <Button variant="secondary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Card>
      </Container>
    </div>
  );
}

export default Home;
