import * as React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@mui/joy/Checkbox';

function JoyCheckBox({
  onChange, value, label, isDisabled, isRequired,
}) {
  return (
    <Checkbox size="sm" label={label} color="primary" checked={value || false} onChange={onChange} disabled={isDisabled} required={isRequired} />
  );
}

export { JoyCheckBox };

JoyCheckBox.propTypes = {
  value: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired, 
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};