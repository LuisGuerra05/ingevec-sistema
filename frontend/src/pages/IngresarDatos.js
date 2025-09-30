import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import Select from 'react-select';
import "./IngresarDatos.css";

const azul1 = "#0070b7";

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: 12,
    boxShadow: state.isFocused ? `0 0 0 0.2rem rgba(0,112,183,0.12)` : base.boxShadow,
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 12,
    boxShadow: '0 4px 16px 0 rgba(0,112,183,0.10)',
    zIndex: 20,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? azul1
      : state.isFocused
      ? "#e6f2fa"
      : "#fff",
    color: state.isSelected ? "#fff" : azul1,
    cursor: 'pointer',
    fontSize: '1rem',
  }),
};

const razones = [
  "Abandono e intervención de obra",
  "Intervención de contrato",
  "Mal Funcionamiento plazos",
  "Atraso y daños por trabajos extemporáneos",
  "En revisión con subcontrato mal Funcionamiento",
  "Juicio Laboral Ingevec paga costas e indemnización",
  "Quiebra Subcontrato",
  "Abandono de obra",
  "Mal Funcionamiento intervención",
  "Daños Por filtraciones",
  "Plazo excedido contrato"
];

const opciones = razones.map(r => ({ value: r, label: r }));

function IngresarDatos() {
  const [empresa, setEmpresa] = useState("");
  const [fecha, setFecha] = useState("");
  const [incumplimiento, setIncumplimiento] = useState(false);
  const [razon, setRazon] = useState("");
  const [gravedad, setGravedad] = useState(1);
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
        body: JSON.stringify({ empresa, fecha, incumplimiento, razon, gravedad })
      });
      const data = await res.json();
      if (data.ok) {
        setOk("Incumplimiento guardado correctamente");
        setEmpresa("");
        setFecha("");
        setIncumplimiento(false);
        setRazon("");
        setGravedad(1);
      } else {
        setError(data.error || "Error al guardar");
      }
    } catch {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="ingresar-bg">
      <Card className="ingresar-card p-4">
        <h2 className="mb-4 text-center">Ingresar Incumplimiento</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {ok && <Alert variant="success">{ok}</Alert>}
        <Form onSubmit={handleSubmit}>
          <div className="ingresar-form-row">
            <div className="ingresar-form-col">
              <Form.Group className="mb-3">
                <Form.Label>Nombre de la Empresa</Form.Label>
                <Form.Control
                  type="text"
                  value={empresa}
                  onChange={e => setEmpresa(e.target.value)}
                  required
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
            </div>
            {incumplimiento && (
              <div className="ingresar-form-col">
                <Form.Group className="mb-3">
                  <Form.Label>Razón de Incumplimiento</Form.Label>
                  <Select
                    options={opciones}
                    value={opciones.find(o => o.value === razon)}
                    onChange={o => setRazon(o.value)}
                    placeholder="Seleccione una razón..."
                    styles={customSelectStyles}
                  />
                </Form.Group>
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
            )}
          </div>
          <Button type="submit" variant="primary" className="w-100 mt-2" size="lg">
            Guardar
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default IngresarDatos;