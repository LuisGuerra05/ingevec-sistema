import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import "./IngresarDatos.css";
import { razones, empresas } from "../data/opciones";
import CustomSelect from "../components/CustomSelect";

const opcionesRazones = razones.map(r => ({ value: r, label: r }));
const opcionesEmpresas = empresas.map(e => ({ value: e, label: e }));

function IngresarDatos() {
  const [empresa, setEmpresa] = useState("");
  const [fecha, setFecha] = useState("");
  const [incumplimiento, setIncumplimiento] = useState(false);
  const [razon, setRazon] = useState("");
  const [gravedad, setGravedad] = useState(1);
  const [retenciones, setRetenciones] = useState("");
  const [comentario, setComentario] = useState(""); // <-- nuevo estado
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    if (!empresa || !fecha) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (incumplimiento && (!razon || !gravedad)) {
      setError("Debe ingresar razón y gravedad");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/incumplimientos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          empresa,
          fecha,
          incumplimiento,
          razon,
          gravedad,
          retenciones: incumplimiento && retenciones !== "" ? Number(retenciones) : undefined,
          comentario: !incumplimiento ? comentario : undefined // <-- guardar solo si no hubo incumplimiento
        })
      });
      const data = await res.json();
      if (data.ok) {
        setOk("Registro guardado correctamente");
        setEmpresa("");
        setFecha("");
        setIncumplimiento(false);
        setRazon("");
        setGravedad(1);
        setRetenciones("");
        setComentario("");
      } else {
        setError(data.error || "Error al guardar");
      }
    } catch {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="page-bg">
      <Card className="page-card">
        <h2 className="mb-2 text-center">Trazabilidad de Subcontratista</h2>
        <p className="text-center text-muted mb-4">
          Registre cumplimiento o incumplimiento del subcontratista.
        </p>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la Empresa</Form.Label>
            <CustomSelect
              options={opcionesEmpresas}
              value={opcionesEmpresas.find(o => o.value === empresa) || null}
              onChange={o => setEmpresa(o.value)}
              placeholder="Seleccione una empresa..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
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
            <div className="ingresar-form-row">
              <div className="ingresar-form-col">
                <Form.Group className="mb-3">
                  <Form.Label>Razón de Incumplimiento</Form.Label>
                  <CustomSelect
                    options={opcionesRazones}
                    value={opcionesRazones.find(o => o.value === razon) || null}
                    onChange={o => setRazon(o.value)}
                    placeholder="Seleccione una razón..."
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Monto de Retenciones (CLP)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="1"
                    value={retenciones}
                    onChange={e => setRetenciones(e.target.value)}
                    placeholder="Ej: 500000"
                  />
                  <Form.Text className="text-muted">
                    Si no hubo retenciones o no se conoce el dato, deje el campo vacío.
                  </Form.Text>
                </Form.Group>
              </div>
              <div className="ingresar-form-col">
                <Form.Group className="mb-4">
                  <Form.Label>Gravedad de Incumplimiento</Form.Label>
                  <Form.Range
                    min={1}
                    max={5}
                    value={gravedad}
                    onChange={e => setGravedad(Number(e.target.value))}
                  />
                  <div>Gravedad: {gravedad}</div>
                </Form.Group>
              </div>
            </div>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                placeholder="Escriba un comentario sobre el cumplimiento (opcional)"
              />
            </Form.Group>
          )}

          {error && <Alert variant="danger">{error}</Alert>}
          {ok && <Alert variant="success">{ok}</Alert>}

          <Button type="submit" variant="primary" className="w-100 mt-2" size="lg">
            Guardar
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default IngresarDatos;
