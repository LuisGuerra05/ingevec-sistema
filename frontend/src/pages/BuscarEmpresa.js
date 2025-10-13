import React, { useState, useEffect } from "react";
import CustomSelect from "../components/CustomSelect";
import "./BuscarEmpresa.css";
import { useNavigate } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import axios from "../api/axiosInstance";

function BuscarEmpresa() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [empresaInfo, setEmpresaInfo] = useState(null);
  const [loadingEmpresa, setLoadingEmpresa] = useState(false);
  const navigate = useNavigate();

  // --- Cargar lista de empresas ---
  useEffect(() => {
    let mounted = true;
    axios
      .get("/empresas")
      .then(({ data }) => {
        if (!mounted) return;
        setEmpresas(
          data.map((e) => ({
            value: e.nombre,
            label: e.nombre,
            semaforo: e.semaforo,
          }))
        );
      })
      .catch(() => {
        if (!mounted) return;
        setEmpresas([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // --- Consultar empresa seleccionada ---
  useEffect(() => {
    if (!empresaSeleccionada) {
      setEmpresaInfo(null);
      return;
    }

    let mounted = true;
    setLoadingEmpresa(true);
    setEmpresaInfo(null);

    axios
      .get(`/empresas/${encodeURIComponent(empresaSeleccionada.value)}`)
      .then(({ data }) => {
        if (!mounted) return;
        setEmpresaInfo(data);
      })
      .catch(() => {
        if (!mounted) return;
        setEmpresaInfo(null);
      })
      .finally(() => {
        if (mounted) setLoadingEmpresa(false);
      });

    return () => {
      mounted = false;
    };
  }, [empresaSeleccionada]);

  const getColor = (semaforo) => {
    if (semaforo === "rojo") return "#e53935";
    if (semaforo === "amarillo") return "#fbc02d";
    if (semaforo === "verde") return "#43a047";
    return "#ccc";
  };

  return (
    <div className="page-bg">
      <div className="page-card">
        <h2 className="mb-2 text-center">Buscar Subcontratista</h2>
        <p className="text-center text-muted mb-4">
          Consulte el estado y clasificación del subcontratista en el sistema de semáforo.
        </p>

        <CustomSelect
          options={empresas}
          value={empresaSeleccionada}
          onChange={(o) => setEmpresaSeleccionada(o)}
          placeholder="Seleccione una empresa..."
        />

        {/* 🔄 Spinner de carga mientras se obtiene la info */}
        {loadingEmpresa && (
          <div className="mt-4 text-center">
            <Spinner animation="border" variant="primary" role="status" />
            <p className="text-muted mt-2 mb-0">Cargando información...</p>
          </div>
        )}

        {/* ✅ Resultado cuando se obtiene la empresa */}
        {empresaInfo && !loadingEmpresa && (
          <div className="mt-4 resultado-empresa text-center">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: getColor(empresaInfo.semaforo),
                  border: "2px solid #ccc",
                }}
                title={`Semáforo: ${empresaInfo.semaforo}`}
              />
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                {empresaInfo.nombre}
              </span>
            </div>

            <div
              className="mt-2 mb-2"
              style={{
                color: getColor(empresaInfo.semaforo),
                fontWeight: "bold",
              }}
            >
              {empresaInfo.semaforo === "rojo" && "Alto riesgo"}
              {empresaInfo.semaforo === "amarillo" && "Riesgo medio"}
              {empresaInfo.semaforo === "verde" && "Bajo riesgo"}
            </div>

            <Button
              variant="primary"
              style={{ borderRadius: 12, marginTop: 8 }}
              onClick={() =>
                navigate(`/empresa/${encodeURIComponent(empresaInfo.nombre)}`)
              }
            >
              Ver detalle de la empresa
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuscarEmpresa;
