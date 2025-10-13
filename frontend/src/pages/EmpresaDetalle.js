import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EmpresaDetalle.css";
import axios from "../api/axiosInstance";

const SEMAFORO_COLORS = {
  rojo: "#e53935",
  amarillo: "#fbc02d",
  verde: "#43a047",
};

function EmpresaDetalle() {
  const { nombre } = useParams();
  const [empresa, setEmpresa] = useState(null);
  const [incumplimientos, setIncumplimientos] = useState([]);
  const [cumplimientos, setCumplimientos] = useState([]);

  useEffect(() => {
    let mounted = true;

    axios
      .get(`/empresas/${encodeURIComponent(nombre)}`)
      .then(({ data }) => mounted && setEmpresa(data))
      .catch(() => mounted && setEmpresa(null));

    axios
      .get(`/incumplimientos`, { params: { empresa: nombre } })
      .then(({ data }) => {
        if (!mounted) return;
        setIncumplimientos(data.filter((i) => i.incumplimiento));
        setCumplimientos(data.filter((i) => !i.incumplimiento));
      })
      .catch(() => {
        if (!mounted) return;
        setIncumplimientos([]);
        setCumplimientos([]);
      });

    return () => (mounted = false);
  }, [nombre]);

  const getSemaforoText = (color) => {
    if (color === "rojo") return { text: "Alto riesgo", style: { color: SEMAFORO_COLORS.rojo } };
    if (color === "amarillo") return { text: "Riesgo medio", style: { color: SEMAFORO_COLORS.amarillo } };
    if (color === "verde") return { text: "Bajo riesgo", style: { color: SEMAFORO_COLORS.verde } };
    return { text: "Sin clasificación", style: { color: "#888" } };
  };

  return (
    <div className="page-bg">
      <div className="page-card">
        {empresa ? (
          <>
            <div className="semaforo-container">
              <div className="semaforo-vertical">
                {["rojo", "amarillo", "verde"].map((c) => (
                  <div
                    key={c}
                    className={`semaforo-circulo ${empresa.semaforo === c ? "activo" : ""}`}
                    style={{ background: SEMAFORO_COLORS[c] }}
                  />
                ))}
              </div>
              <div className="semaforo-info">
                <h2 className="empresa-nombre">{empresa.nombre}</h2>
                <div className="semaforo-text" style={getSemaforoText(empresa.semaforo).style}>
                  {getSemaforoText(empresa.semaforo).text}
                </div>
              </div>
            </div>

            {/* Incumplimientos */}
            <div className="mt-4">
              <h5>Historial de Incumplimientos</h5>
              <div className="table-responsive rounded-3 shadow-sm overflow-hidden">
                <table className="table table-striped table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Obra</th>
                      <th>Razón</th>
                      <th className="text-end">Gravedad</th>
                      <th className="text-end">Retención</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incumplimientos.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">
                          Sin registros
                        </td>
                      </tr>
                    ) : (
                      incumplimientos.map((inc, idx) => (
                        <tr key={idx}>
                          <td>{new Date(inc.fecha).toLocaleDateString()}</td>
                          <td>{inc.obra}</td>
                          <td>{inc.razon || "-"}</td>
                          <td className="text-end">{inc.gravedad}</td>
                          <td className="text-end">{inc.retencionSiNo}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cumplimientos */}
            <div className="mt-5">
              <h5>Historial de Cumplimientos</h5>
              <div className="table-responsive rounded-3 shadow-sm overflow-hidden">
                <table className="table table-striped table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Obra</th>
                      <th>Comentario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cumplimientos.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center text-muted">
                          Sin registros
                        </td>
                      </tr>
                    ) : (
                      cumplimientos.map((c, idx) => (
                        <tr key={idx}>
                          <td>{new Date(c.fecha).toLocaleDateString()}</td>
                          <td>{c.obra}</td>
                          <td>{c.comentario || "Sin comentario"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">Cargando empresa...</div>
        )}
      </div>
    </div>
  );
}

export default EmpresaDetalle;
