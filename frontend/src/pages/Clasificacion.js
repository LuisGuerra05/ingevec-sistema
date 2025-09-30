import React, { useEffect, useState } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Clasificacion.css";

const COLOR_LABELS = {
  rojo: { label: "Alto riesgo", color: "#e53935" },
  amarillo: { label: "Riesgo medio", color: "#fbc02d" },
  verde: { label: "Bajo riesgo", color: "#43a047" }
};

function Clasificacion() {
  const [empresas, setEmpresas] = useState({ rojo: [], amarillo: [], verde: [] });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/empresas")
      .then(res => res.json())
      .then(data => {
        const agrupadas = { rojo: [], amarillo: [], verde: [] };
        data.forEach(e => {
          if (agrupadas[e.semaforo]) agrupadas[e.semaforo].push(e);
        });
        setEmpresas(agrupadas);
      });
  }, []);

  return (
    <div className="page-bg">
      <div className="page-card">
        <h2 className="mb-2 text-center">Clasificación de Subcontratistas</h2>
        <p className="text-center text-muted mb-4">
        Visualice las empresas agrupadas según su nivel de riesgo en el sistema de semáforo.
        </p>
        <Accordion alwaysOpen>
          {["rojo", "amarillo", "verde"].map(color => (
            <Accordion.Item eventKey={color} key={color}>
              <Accordion.Header>
                <span style={{
                  display: "inline-block",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: COLOR_LABELS[color].color,
                  marginRight: 12,
                  border: "2px solid #222",
                  verticalAlign: "middle"
                }} />
                <span style={{
                  color: COLOR_LABELS[color].color,
                  fontWeight: "bold",
                  fontSize: "1.1rem"
                }}>
                  {COLOR_LABELS[color].label}
                </span>
              </Accordion.Header>
              <Accordion.Body>
                {empresas[color].length === 0 ? (
                  <div className="text-muted">No hay empresas en esta categoría.</div>
                ) : (
                  <ul className="lista-empresas">
                    {empresas[color].map(e => (
                      <li key={e.nombre}>
                        <Button
                          variant="link"
                          className="empresa-link"
                          onClick={() => navigate(`/empresa/${encodeURIComponent(e.nombre)}`)}
                        >
                          {e.nombre}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default Clasificacion;