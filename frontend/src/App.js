import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './ProtectedRoute.jsx';
import Layout from "./components/Layout";

// Puedes crear estos componentes vacíos por ahora
const BuscarEmpresa = () => <div>Buscar Empresa</div>;
const Clasificacion = () => <div>Clasificación</div>;
const IngresarDatos = () => <div>Ingresar Datos</div>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/buscar-empresa"
        element={
          <ProtectedRoute>
            <Layout>
              <BuscarEmpresa />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/clasificacion"
        element={
          <ProtectedRoute>
            <Layout>
              <Clasificacion />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ingresar-datos"
        element={
          <ProtectedRoute>
            <Layout>
              <IngresarDatos />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;