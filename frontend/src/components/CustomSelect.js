// src/components/CustomSelect.js
import React from "react";
import Select from "react-select";

const azul1 = "#0070b7";

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: 12,
    boxShadow: state.isFocused ? `0 0 0 0.2rem rgba(0,112,183,0.12)` : base.boxShadow,
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 0,
    boxShadow: "0 4px 16px 0 rgba(0,112,183,0.10)",
    zIndex: 20,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? azul1
      : state.isFocused
      ? "#e6f2fa"
      : "#fff",
    cursor: "pointer",
    fontSize: "1rem",
  }),
};

function CustomSelect({ options, value, onChange, placeholder }) {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      styles={customSelectStyles}
      noOptionsMessage={() => "No hay opciones disponibles"} // 👈 en español
    />
  );
}

export default CustomSelect;
