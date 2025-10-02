// src/routes/ProtectedRoute.js
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "./api/axiosInstance";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking"); // checking | authed | denied

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("denied");
      return;
    }
    let mounted = true;
    axios
      .get("/me")
      .then(() => mounted && setStatus("authed"))
      .catch(() => {
        // Si /me falla, el interceptor ya limpiará y redirigirá también,
        // pero devolvemos denied para SSR/CSR consistente.
        if (mounted) setStatus("denied");
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
        <div className="text-muted">Verificando sesión…</div>
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
