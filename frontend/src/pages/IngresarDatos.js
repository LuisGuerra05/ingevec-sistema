import React, { useEffect, useState } from "react";
import { Form, Button, Card, Alert, InputGroup } from "react-bootstrap";
import "./IngresarDatos.css";
import CustomSelect from "../components/CustomSelect";
import axios from "../api/axiosInstance";
import { PlusCircle } from "react-bootstrap-icons";

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

  const [modoNueva, setModoNueva] = useState({ empresa: false, obra: false, razon: false });
  const [valorNuevo, setValorNuevo] = useState({ empresa: "", obra: "", razon: "" });

  // === Cargar opciones desde BD ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, razRes, obrRes] = await Promise.all([
          axios.get("/opciones/empresa/list"),
          axios.get("/opciones/razon/list"),
          axios.get("/opciones/obra/list"),
        ]);

        setEmpresas(empRes.data.map((e) => e.nombre).filter(Boolean).sort());
        setRazones(razRes.data.map((r) => r.nombre).filter(Boolean).sort());
        setObras(obrRes.data.map((o) => o.nombre).filter(Boolean).sort());
      } catch (err) {
        console.error("❌ Error cargando opciones:", err);
        setError("No se pudieron cargar las opciones desde la base de datos.");
      }
    };
    fetchData();
  }, []);

  // === Actualizar color empresa ===
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

  // === Guardar nuevas opciones solo si no existen ===
  const guardarOpcionesNuevas = async () => {
    try {
      if (modoNueva.empresa && valorNuevo.empresa) {
        await axios.post("/opciones/empresa", { valor: valorNuevo.empresa });
        setEmpresas((prev) => [...new Set([...prev, valorNuevo.empresa])].sort());
        setEmpresa(valorNuevo.empresa);
      }
      if (modoNueva.obra && valorNuevo.obra) {
        await axios.post("/opciones/obra", { valor: valorNuevo.obra });
        setObras((prev) => [...new Set([...prev, valorNuevo.obra])].sort());
        setObra(valorNuevo.obra);
      }
      if (modoNueva.razon && valorNuevo.razon) {
        await axios.post("/opciones/razon", { valor: valorNuevo.razon });
        setRazones((prev) => [...new Set([...prev, valorNuevo.razon])].sort());
        setRazon(valorNuevo.razon);
      }
    } catch (err) {
      console.error("Error guardando opciones nuevas:", err);
    }
  };

  // === Enviar formulario completo ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    // Primero guardamos nuevas opciones si las hay
    await guardarOpcionesNuevas();

    const empresaFinal = modoNueva.empresa ? valorNuevo.empresa : empresa;
    const obraFinal = modoNueva.obra ? valorNuevo.obra : obra;
    const razonFinal = modoNueva.razon ? valorNuevo.razon : razon;

    if (!empresaFinal || !fecha || !obraFinal) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (incumplimiento && (!razonFinal || !gravedad)) {
      setError("Debe ingresar razón y gravedad");
      return;
    }

    try {
      const payload = {
        empresa: empresaFinal,
        obra: obraFinal,
        fecha,
        incumplimiento,
        razon: incumplimiento ? razonFinal : undefined,
        gravedad: incumplimiento ? gravedad : undefined,
        retencionSiNo: retencionSiNo ? "Sí" : "No",
        comentario: !incumplimiento ? comentario : undefined,
      };

      const { data } = await axios.post("/incumplimientos", payload);

      if (data.ok) {
        setOk("Registro guardado correctamente");
        const res = await axios.get(`/empresas/${encodeURIComponent(empresaFinal)}`);
        setColorActual(res.data?.semaforo || null);

        // Reset
        setEmpresa("");
        setObra("");
        setRazon("");
        setFecha("");
        setGravedad(1);
        setRetencionSiNo(false);
        setComentario("");
        setModoNueva({ empresa: false, obra: false, razon: false });
        setValorNuevo({ empresa: "", obra: "", razon: "" });
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

  // === Select con opción de nueva entrada ===
  const renderSelector = (tipo, label, lista, valor, setValor) => (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>

      {modoNueva[tipo] ? (
        <Form.Control
          type="text"
          placeholder={`Escriba nueva ${label.toLowerCase()}...`}
          value={valorNuevo[tipo]}
          onChange={(e) =>
            setValorNuevo((prev) => ({ ...prev, [tipo]: e.target.value }))
          }
          required
        />
      ) : (
        <CustomSelect
          options={[
            ...lista.map((x) => ({ value: x, label: x })),
            {
              value: "Nueva",
              label: (
                <span>
                  <PlusCircle className="me-1" /> Nueva...
                </span>
              ),
            },
          ]}
          value={valor ? { value: valor, label: valor } : null}
          onChange={(o) => {
            if (o.value === "Nueva") {
              setModoNueva((prev) => ({ ...prev, [tipo]: true }));
              setValorNuevo((prev) => ({ ...prev, [tipo]: "" }));
            } else {
              setValor(o.value);
            }
          }}
          placeholder={`Seleccione una ${label.toLowerCase()}...`}
        />
      )}
    </Form.Group>
  );


  return (
    <div className="page-bg">
      <Card className="page-card">
        <h2 className="mb-2 text-center">Trazabilidad de Subcontratista</h2>
        <p className="text-center text-muted mb-4">
          Registre cumplimiento o incumplimiento del subcontratista.
        </p>

        <Form onSubmit={handleSubmit}>
          {renderSelector("empresa", "Nombre de la Empresa", empresas, empresa, setEmpresa)}
          {renderSelector("obra", "Obra", obras, obra, setObra)}

          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </Form.Group>

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
              {renderSelector("razon", "Razón de Incumplimiento", razones, razon, setRazon)}

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
