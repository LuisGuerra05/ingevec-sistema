import React, { useEffect, useState } from "react";
import { Accordion, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./Clasificacion.css";
import axios from "../api/axiosInstance";

const COLOR_LABELS = {
  rojo: { label: "Alto riesgo", color: "#e53935" },
  amarillo: { label: "Riesgo medio", color: "#fbc02d" },
  verde: { label: "Bajo riesgo", color: "#43a047" },
};

function Clasificacion() {
  const [empresas, setEmpresas] = useState({ rojo: [], amarillo: [], verde: [] });
  const [activeKey, setActiveKey] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // --- Cargar datos ---
  useEffect(() => {
    let mounted = true;
    axios
      .get("/empresas")
      .then(({ data }) => {
        if (!mounted) return;
        const agrupadas = { rojo: [], amarillo: [], verde: [] };
        data.forEach((e) => {
          if (agrupadas[e.semaforo]) agrupadas[e.semaforo].push(e);
        });
        setEmpresas(agrupadas);
      })
      .catch(() => {
        if (!mounted) return;
        setEmpresas({ rojo: [], amarillo: [], verde: [] });
      });
    return () => {
      mounted = false;
    };
  }, []);

  // --- Si viene un color desde Home, abrirlo automáticamente ---
  useEffect(() => {
    if (location.state?.color) {
      setActiveKey(location.state.color);
    }
  }, [location.state]);

  return (
    <div className="page-bg">
      <div className="page-card">
        <h2 className="mb-2 text-center">Clasificación de Subcontratistas</h2>
        <p className="text-center text-muted mb-4">
          Visualice las empresas agrupadas según su nivel de riesgo en el sistema de semáforo.
        </p>

        <Accordion alwaysOpen activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
          {["rojo", "amarillo", "verde"].map((color) => (
            <Accordion.Item eventKey={color} key={color}>
              <Accordion.Header>
                <span
                  style={{
                    display: "inline-block",
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: COLOR_LABELS[color].color,
                    marginRight: 12,
                    border: "2px solid #222",
                    verticalAlign: "middle",
                  }}
                />
                <span
                  style={{
                    color: COLOR_LABELS[color].color,
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  {COLOR_LABELS[color].label}
                </span>
              </Accordion.Header>

              <Accordion.Body>
                {empresas[color].length === 0 ? (
                  <div className="text-muted">No hay empresas en esta categoría.</div>
                ) : (
                  <ul className="lista-empresas list-unstyled mb-0">
                    {empresas[color].map((e) => (
                      <li key={e.nombre} className="mb-1">
                        <Button
                          variant="link"
                          className="empresa-link btn btn-link w-100 text-start lh-sm py-2"
                          title={e.nombre}
                          onClick={() =>
                            navigate(`/empresa/${encodeURIComponent(e.nombre)}`)
                          }
                        >
                          <span className="text-break empresa-text">{e.nombre}</span>
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
