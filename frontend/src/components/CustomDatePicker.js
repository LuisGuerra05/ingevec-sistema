// src/components/CustomDatePicker.js
import React, { forwardRef } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css"; // estilos base del datepicker
import { Form, InputGroup } from "react-bootstrap";
import { Calendar } from "react-bootstrap-icons"; 
import "./CustomDatePicker.css"; // 👈 importa tu CSS personalizado (ajusta la ruta si es necesario)

registerLocale("es", es);

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <InputGroup>
    <Form.Control
      type="text"
      value={value}
      onClick={onClick}
      ref={ref}
      placeholder={placeholder || "dd/mm/aaaa"}
      readOnly
    />
    <InputGroup.Text onClick={onClick} style={{ cursor: "pointer" }}>
      <Calendar />
    </InputGroup.Text>
  </InputGroup>
));

function CustomDatePicker({ selected, onChange, placeholder }) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat="dd/MM/yyyy"
      locale="es"
      placeholderText={placeholder || "dd/mm/aaaa"}
      customInput={<CustomInput />}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
    />
  );
}

export default CustomDatePicker;
