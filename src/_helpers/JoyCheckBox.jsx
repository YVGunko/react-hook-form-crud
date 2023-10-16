import * as React from 'react';
import Checkbox from '@mui/joy/Checkbox';

function JoyCheckBox({
  onChange, value, label, isDisabled, isRequired, theme,
}) {
  return (
    <Checkbox size="sm" label={label} color="primary" checked={value || false} onChange={onChange} disabled={isDisabled} required={isRequired} />
  );
}

export { JoyCheckBox };
