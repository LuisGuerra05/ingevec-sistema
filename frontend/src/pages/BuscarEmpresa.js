import React, { useState, useEffect } from "react";
import CustomSelect from "../components/CustomSelect";
import "./BuscarEmpresa.css";
import { useNavigate } from "react-router-dom";

function BuscarEmpresa() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [empresaInfo, setEmpresaInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/empresas")
      .then(res => res.json())
      .then(data => setEmpresas(data.map(e => ({ value: e.nombre, label: e.nombre, semaforo: e.semaforo }))));
  }, []);

  useEffect(() => {
    if (empresaSeleccionada) {
      fetch(`/api/empresas/${encodeURIComponent(empresaSeleccionada.value)}`)
        .then(res => res.json())
        .then(data => setEmpresaInfo(data));
    } else {
      setEmpresaInfo(null);
    }
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
          onChange={o => setEmpresaSeleccionada(o)}
          placeholder="Seleccione una empresa..."
        />
        {empresaInfo && (
          <div className="mt-4 resultado-empresa text-center">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: getColor(empresaInfo.semaforo),
                  border: "2px solid #ccc"
                }}
                title={`Semáforo: ${empresaInfo.semaforo}`}
              />
              <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{empresaInfo.nombre}</span>
            </div>
            <div className="mt-2 mb-2" style={{ color: getColor(empresaInfo.semaforo), fontWeight: "bold" }}>
              {empresaInfo.semaforo === "rojo" && "Alto riesgo"}
              {empresaInfo.semaforo === "amarillo" && "Riesgo medio"}
              {empresaInfo.semaforo === "verde" && "Bajo riesgo"}
            </div>
            <button
              className="btn btn-outline-primary"
              style={{ borderRadius: 12, marginTop: 8 }}
              onClick={() => navigate(`/empresa/${encodeURIComponent(empresaInfo.nombre)}`)}
            >
              Ver detalle de la empresa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuscarEmpresa;