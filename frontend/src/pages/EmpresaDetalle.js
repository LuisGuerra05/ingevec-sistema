import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EmpresaDetalle.css";

const SEMAFORO_COLORS = {
  rojo: "#e53935",
  amarillo: "#fbc02d",
  verde: "#43a047"
};

function EmpresaDetalle() {
  const { nombre } = useParams();
  const [empresa, setEmpresa] = useState(null);
  const [incumplimientos, setIncumplimientos] = useState([]);
  const [cumplimientos, setCumplimientos] = useState([]);

  useEffect(() => {
    fetch(`/api/empresas/${encodeURIComponent(nombre)}`)
      .then(res => res.json())
      .then(data => setEmpresa(data));

    fetch(`/api/incumplimientos?empresa=${encodeURIComponent(nombre)}`)
      .then(res => res.json())
      .then(data => {
        setIncumplimientos(data.filter(inc => inc.incumplimiento === true));
        setCumplimientos(data.filter(inc => inc.incumplimiento === false));
      });
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
            {/* Semáforo + nombre + riesgo */}
            <div className="semaforo-container">
              <div className="semaforo-vertical">
                <div
                  className={`semaforo-circulo ${empresa.semaforo === "rojo" ? "activo" : ""}`}
                  style={{ background: SEMAFORO_COLORS.rojo }}
                />
                <div
                  className={`semaforo-circulo ${empresa.semaforo === "amarillo" ? "activo" : ""}`}
                  style={{ background: SEMAFORO_COLORS.amarillo }}
                />
                <div
                  className={`semaforo-circulo ${empresa.semaforo === "verde" ? "activo" : ""}`}
                  style={{ background: SEMAFORO_COLORS.verde }}
                />
              </div>
              <div className="semaforo-info">
                <h2 className="empresa-nombre">{empresa.nombre}</h2>
                <div
                  className="semaforo-text"
                  style={getSemaforoText(empresa.semaforo).style}
                >
                  {getSemaforoText(empresa.semaforo).text}
                </div>
              </div>
            </div>

            {/* Tabla de incumplimientos */}
            <div className="mt-4">
              <h5>Historial de Incumplimientos</h5>
              <table className="incumplimientos-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Razón de Incumplimiento</th>
                    <th className="num-col">Gravedad</th>
                    <th className="num-col">Retenciones (CLP)</th>
                  </tr>
                </thead>
                <tbody>
                  {incumplimientos.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", color: "#888" }}>
                        Sin registros
                      </td>
                    </tr>
                  ) : (
                    incumplimientos.map((inc, idx) => (
                      <tr key={idx}>
                        <td>{new Date(inc.fecha).toLocaleDateString()}</td>
                        <td>{inc.razon || "-"}</td>
                        <td className="num-col">{inc.gravedad || "-"}</td>
                        <td className="num-col">
                          {inc.retenciones !== undefined ? inc.retenciones.toLocaleString() : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Tabla de cumplimientos */}
            <div className="mt-5">
              <h5>Historial de Cumplimientos</h5>
              <table className="incumplimientos-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {cumplimientos.length === 0 ? (
                    <tr>
                      <td colSpan={2} style={{ textAlign: "center", color: "#888" }}>
                        Sin registros
                      </td>
                    </tr>
                  ) : (
                    cumplimientos.map((inc, idx) => (
                      <tr key={idx}>
                        <td>{new Date(inc.fecha).toLocaleDateString()}</td>
                        <td>
                          {inc.comentario && inc.comentario.trim() !== ""
                            ? inc.comentario
                            : "Sin comentario"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
