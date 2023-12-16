import * as React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@mui/joy/Checkbox';

function JoyCheckBox({
  onChange, value, label, isDisabled, isRequired,
}) {
  return (
    <Checkbox size="sm" 
    label={label} 
    color="primary" 
    checked={value || false} 
    onChange={onChange} 
    disabled={isDisabled || false} 
    required={isRequired || false} />
  );
}

export { JoyCheckBox };

JoyCheckBox.propTypes = {
  value: PropTypes.bool,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool, 
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};