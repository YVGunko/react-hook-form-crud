import React from 'react';

function CheckBox({ onChange, value }) {
  return (
    <div style={{ cursor: 'pointer' }}>
      <input
        type="checkbox"
        onChange={onChange}
        checked={value}
      />
    </div>
  );
}

export { CheckBox };
