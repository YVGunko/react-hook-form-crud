import React from 'react';
// import ''./style.css";

function CheckBox({
  onChange, value, label, isDisabled,
}) {
  return (
    <div className="checkbox-wrapper">
      <label>
        <input
          type="checkbox"
          onChange={onChange}
          checked={value}
          disabled={isDisabled}
        />
        <span>{label}</span>
      </label>
    </div>
  );
}

export { CheckBox };
