import React from "react";
import { useState } from "react";
import "./formText.css";

const FormText = ({ text, placeholder, updateText, onUpdate }) => {
  const [value, setValue] = useState(text);

  const handleClickUpdate = () => {
    updateText(value);
    onUpdate();
  };

  return (
    // <div className="formText">FORM TEXT</div>
    <div className="formText">
      <input
        placeholder={placeholder || "text field...."}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <div className="btn" onClick={() => handleClickUpdate()}>
        Update
      </div>
    </div>
  );
};

export default FormText;
