import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import "./Home.css";

const SEMAFORO_COLORS = {
  rojo: "#e53935",
  amarillo: "#fbc02d",
  verde: "#43a047",
};

function Home() {
  const [stats, setStats] = useState({
    verde: 0,
    amarillo: 0,
    rojo: 0,
    sinColor: 0,
    total: 0,
    kpiTrazabilidad: 0,
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  // --- cargar datos ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/empresas");

        let conteo = { verde: 0, amarillo: 0, rojo: 0, sinColor: 0, total: 0 };
        data.forEach((e) => {
          if (e.semaforo === "verde") conteo.verde++;
          else if (e.semaforo === "amarillo") conteo.amarillo++;
          else if (e.semaforo === "rojo") conteo.rojo++;
          else conteo.sinColor++;
        });
        conteo.total = data.length;

        const conTrazabilidad = conteo.total - conteo.sinColor;
        const kpiTrazabilidad =
          conteo.total > 0
            ? ((conTrazabilidad / conteo.total) * 100).toFixed(1)
            : 0;

        setStats({ ...conteo, kpiTrazabilidad });
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- función para ir a clasificación ---
  const handleNavigate = (color) => {
    navigate("/clasificacion", { state: { color } });
  };

  return (
    <div className="home-page">
      <Container className="pt-4 pb-5">
        <Card className="dashboard-card shadow-lg border-0 p-4 p-md-5 mx-auto">
          <div className="text-center mb-4">
            <h2 className="fw-bold titulo-dashboard">
              Radar de Riesgo de Subcontratos
            </h2>
            <p className="subtitulo-dashboard">
              Bienvenido, <b>{user.email}</b>
            </p>
            <p className="descripcion-dashboard">
              Esta herramienta entrega una visión consolidada del ecosistema de
              subcontratistas de Ingevec, permitiendo monitorear niveles de
              riesgo, trazabilidad y desempeño general de cada empresa asociada.
            </p>
          </div>

          {loading ? (
            <div className="text-center mt-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              {/* === Sección del Semáforo === */}
              <Container className="mt-4">
                {[
                  {
                    color: "rojo",
                    label: "Empresas en alto riesgo",
                    value: stats.rojo,
                  },
                  {
                    color: "amarillo",
                    label: "Empresas en riesgo medio",
                    value: stats.amarillo,
                  },
                  {
                    color: "verde",
                    label: "Empresas en bajo riesgo",
                    value: stats.verde,
                  },
                ].map((item, idx) => (
                  <Row
                    key={idx}
                    className="align-items-center justify-content-center mb-4 flex-wrap"
                    onClick={() => handleNavigate(item.color)} // 👈 redirección
                    style={{ cursor: "pointer" }}
                  >
                    <Col
                      xs="auto"
                      className="d-flex justify-content-center mb-3 mb-md-0"
                    >
                      <div
                        className="semaforo-circulo-home"
                        style={{
                          background: SEMAFORO_COLORS[item.color],
                          opacity: item.value > 0 ? 1 : 0.4,
                          boxShadow:
                            item.value > 0
                              ? `0 0 25px 8px ${SEMAFORO_COLORS[item.color]}80`
                              : "none",
                        }}
                      ></div>
                    </Col>

                    <Col xs={10} md={6} lg={5}>
                      <Card className="metric-card shadow-sm border-0 text-start mx-auto">
                        <Card.Body className="d-flex align-items-center gap-3">
                          <div>
                            <h4
                              className={`fw-bold mb-0 text-${
                                item.color === "rojo"
                                  ? "danger"
                                  : item.color === "amarillo"
                                  ? "warning"
                                  : "success"
                              }`}
                            >
                              {item.value}
                            </h4>
                            <small className="text-muted">{item.label}</small>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                ))}
              </Container>

              {/* === Tarjetas inferiores === */}
              <Row className="justify-content-center metricas-inferiores mt-4">
                <Col xs={12} md={5} className="mb-3 mb-md-0">
                  <Card className="info-card shadow-sm border-0 text-center">
                    <Card.Body>
                      <h5 className="fw-semibold mb-1">
                        Empresas sin registros
                      </h5>
                      <h3 className="fw-bold text-secondary mb-0">
                        {stats.sinColor}
                      </h3>
                      <p className="text-muted small mb-0">
                        Sin trazabilidad registrada aún
                      </p>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xs={12} md={5}>
                  <Card className="info-card shadow-sm border-0 text-center">
                    <Card.Body>
                      <h5 className="fw-semibold mb-1">
                        KPI: Subcontratos con trazabilidad digital
                      </h5>
                      <h3 className="fw-bold text-dark mb-0">
                        {stats.kpiTrazabilidad}%
                      </h3>
                      <p className="text-muted small mb-0">
                        {stats.total > 0
                          ? `(${stats.total - stats.sinColor} de ${stats.total} empresas con registros)`
                          : "Sin datos disponibles"}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Card>
      </Container>
    </div>
  );
}

export default Home;
