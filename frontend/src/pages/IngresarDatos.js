// src/pages/IngresarDatos.js
import React, { useEffect, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import "./IngresarDatos.css";
import CustomSelect from "../components/CustomSelect";
import axios from "../api/axiosInstance";

function IngresarDatos() {
  const [empresa, setEmpresa] = useState("");
  const [obra, setObra] = useState("");
  const [fecha, setFecha] = useState("");
  const [incumplimiento, setIncumplimiento] = useState(false);
  const [razon, setRazon] = useState("");
  const [gravedad, setGravedad] = useState(1);
  const [retencionSiNo, setRetencionSiNo] = useState(false);
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [colorActual, setColorActual] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [razones, setRazones] = useState([]);
  const [obras, setObras] = useState([]);

  // === Cargar opciones desde la BD ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, razRes, obrRes] = await Promise.all([
          axios.get("/opciones/empresa/list"),
          axios.get("/opciones/razon/list"),
          axios.get("/opciones/obra/list"),
        ]);

        const empresasOrdenadas = empRes.data
          .map((e) => e.nombre)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));

        const razonesOrdenadas = razRes.data
          .map((r) => r.nombre)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));

        const obrasOrdenadas = obrRes.data
          .map((o) => o.nombre)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));

        setEmpresas(empresasOrdenadas);
        setRazones(razonesOrdenadas);
        setObras(obrasOrdenadas);
      } catch (err) {
        console.error("❌ Error cargando opciones:", err);
        setError("No se pudieron cargar las opciones desde la base de datos.");
      }
    };
    fetchData();
  }, []);

  // === Actualizar color de empresa seleccionada ===
  useEffect(() => {
    if (!empresa) {
      setColorActual(null);
      return;
    }
    axios
      .get(`/empresas/${encodeURIComponent(empresa)}`)
      .then(({ data }) => setColorActual(data?.semaforo || null))
      .catch(() => setColorActual(null));
  }, [empresa, ok]);

  // === Alertas temporales ===
  useEffect(() => {
    if (error) setTimeout(() => setError(""), 3000);
  }, [error]);
  useEffect(() => {
    if (ok) setTimeout(() => setOk(""), 3000);
  }, [ok]);

  // === Crear nueva opción (empresa, razón u obra) ===
  const agregarNuevaOpcion = async (tipo, valor) => {
    if (!valor) return;
    try {
      await axios.post(`/opciones/${tipo}`, { valor });
      if (tipo === "empresa")
        setEmpresas((prev) => [...new Set([...prev, valor])].sort());
      if (tipo === "razon")
        setRazones((prev) => [...new Set([...prev, valor])].sort());
      if (tipo === "obra")
        setObras((prev) => [...new Set([...prev, valor])].sort());
    } catch {
      console.error("Error guardando nueva opción");
    }
  };

  // === Enviar formulario ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    if (!empresa || !fecha || !obra) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (incumplimiento && (!razon || !gravedad)) {
      setError("Debe ingresar razón y gravedad");
      return;
    }

    try {
      const payload = {
        empresa,
        obra,
        fecha,
        incumplimiento,
        razon: incumplimiento ? razon : undefined,
        gravedad: incumplimiento ? gravedad : undefined,
        retencionSiNo: retencionSiNo ? "Sí" : "No",
        comentario: !incumplimiento ? comentario : undefined,
      };

      const { data } = await axios.post("/incumplimientos", payload);

      if (data.ok) {
        setOk("Registro guardado correctamente");
        const res = await axios.get(`/empresas/${encodeURIComponent(empresa)}`);
        setColorActual(res.data?.semaforo || null);

        // reset
        setEmpresa("");
        setObra("");
        setFecha("");
        setIncumplimiento(false);
        setRazon("");
        setGravedad(1);
        setRetencionSiNo(false);
        setComentario("");
      } else {
        setError(data.error || "Error al guardar");
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Error de conexión con el servidor");
    }
  };

  const renderEstadoColor = () => {
    if (colorActual === "rojo")
      return <span style={{ color: "#e53935", fontWeight: "bold" }}>Alto riesgo</span>;
    if (colorActual === "amarillo")
      return <span style={{ color: "#fbc02d", fontWeight: "bold" }}>Riesgo medio</span>;
    if (colorActual === "verde")
      return <span style={{ color: "#43a047", fontWeight: "bold" }}>Bajo riesgo</span>;
    return <span style={{ color: "#888" }}>Sin color asignado</span>;
  };

  return (
    <div className="page-bg">
      <Card className="page-card">
        <h2 className="mb-2 text-center">Trazabilidad de Subcontratista</h2>
        <p className="text-center text-muted mb-4">
          Registre cumplimiento o incumplimiento del subcontratista.
        </p>

        <Form onSubmit={handleSubmit}>
          {/* Empresa */}
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la Empresa</Form.Label>
            <CustomSelect
              options={[
                ...empresas.map((e) => ({ value: e, label: e })),
                { value: "Nueva", label: "➕ Nueva..." },
              ]}
              value={empresa ? { value: empresa, label: empresa } : null}
              onChange={(o) => {
                if (o.value === "Nueva") {
                  const nueva = prompt("Ingrese el nombre de la nueva empresa:");
                  if (nueva) agregarNuevaOpcion("empresa", nueva);
                  setEmpresa(nueva || "");
                } else {
                  setEmpresa(o.value);
                }
              }}
              placeholder="Seleccione una empresa..."
            />
          </Form.Group>

          {/* Obra */}
          <Form.Group className="mb-3">
            <Form.Label>Obra</Form.Label>
            <CustomSelect
              options={[
                ...obras.map((o) => ({ value: o, label: o })),
                { value: "Nueva", label: "➕ Nueva..." },
              ]}
              value={obra ? { value: obra, label: obra } : null}
              onChange={(o) => {
                if (o.value === "Nueva") {
                  const nueva = prompt("Ingrese el nombre de la nueva obra:");
                  if (nueva) agregarNuevaOpcion("obra", nueva);
                  setObra(nueva || "");
                } else {
                  setObra(o.value);
                }
              }}
              placeholder="Seleccione una obra..."
            />
          </Form.Group>

          {/* Fecha */}
          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </Form.Group>

          {/* Incumplimiento */}
          <Form.Group className="mb-3">
            <Form.Label>¿Hubo Incumplimiento?</Form.Label>
            <div>
              <Form.Check
                inline
                label="Sí"
                type="radio"
                name="incumplimiento"
                id="incumplimiento-si"
                checked={incumplimiento === true}
                onChange={() => setIncumplimiento(true)}
              />
              <Form.Check
                inline
                label="No"
                type="radio"
                name="incumplimiento"
                id="incumplimiento-no"
                checked={incumplimiento === false}
                onChange={() => setIncumplimiento(false)}
              />
            </div>
          </Form.Group>

          {incumplimiento ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Razón de Incumplimiento</Form.Label>
                <CustomSelect
                  options={[
                    ...razones.map((r) => ({ value: r, label: r })),
                    { value: "Nueva", label: "➕ Nueva..." },
                  ]}
                  value={razon ? { value: razon, label: razon } : null}
                  onChange={(o) => {
                    if (o.value === "Nueva") {
                      const nueva = prompt("Ingrese una nueva razón:");
                      if (nueva) agregarNuevaOpcion("razon", nueva);
                      setRazon(nueva || "");
                    } else {
                      setRazon(o.value);
                    }
                  }}
                  placeholder="Seleccione una razón..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>¿Hubo Retención?</Form.Label>
                <div>
                  <Form.Check
                    inline
                    label="Sí"
                    type="radio"
                    name="retencion"
                    id="retencion-si"
                    checked={retencionSiNo === true}
                    onChange={() => setRetencionSiNo(true)}
                  />
                  <Form.Check
                    inline
                    label="No"
                    type="radio"
                    name="retencion"
                    id="retencion-no"
                    checked={retencionSiNo === false}
                    onChange={() => setRetencionSiNo(false)}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Gravedad de Incumplimiento</Form.Label>
                <Form.Range
                  min={1}
                  max={5}
                  value={gravedad}
                  onChange={(e) => setGravedad(Number(e.target.value))}
                />
                <div>Gravedad: {gravedad}</div>
              </Form.Group>
            </>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escriba un comentario sobre el cumplimiento (opcional)"
              />
            </Form.Group>
          )}

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          {ok && (
            <Alert variant="success" dismissible onClose={() => setOk("")}>
              {ok}
            </Alert>
          )}

          <Button type="submit" variant="primary" className="w-100 mt-2" size="lg">
            Guardar
          </Button>
        </Form>

        {empresa && (
          <div className="text-center mt-4">
            <strong>Estado actual:</strong> {renderEstadoColor()}
          </div>
        )}
      </Card>
    </div>
  );
}

export default IngresarDatos;
