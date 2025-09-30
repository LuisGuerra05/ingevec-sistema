import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './ProtectedRoute.jsx';
import Layout from "./components/Layout";
import IngresarDatos from './pages/IngresarDatos';
import BuscarEmpresa from './pages/BuscarEmpresa';
import EmpresaDetalle from './pages/EmpresaDetalle';
import Clasificacion from './pages/Clasificacion';
import './App.css';


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

      <Route
        path="/empresa/:nombre"
        element={
          <ProtectedRoute>
            <Layout>
              <EmpresaDetalle />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;