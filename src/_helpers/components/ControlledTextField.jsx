import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import { Divider } from '@mui/material';

function ControlledTextField({ name, control, label, focused, type, }) {
  function isNumber(str) {
    if (str.trim() === '' || str.trim() === 'e') {
      return false;
    }
    if (isNaN(str)) {
      return false;
    }
    if (Number(str) < 1 || Number(str) > 99999) {
      return false;
    }
    return true;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
      }) => (
        <>
          <Grid item xs={1}>
            <Divider light orientation="vertical" />
          </Grid>
          <TextField
            type={type}
            size="small"
            onChange={(event) => {
              (type !== "number")
              ? onChange(event.target.value) 
              : ( isNumber(event?.target?.value) ? onChange(event.target.value) : null );
            }}
            value={value || ''}
            fullWidth
            label={label}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            inputRef={focused ? ((input) => input?.focus()) : undefined} 
            error={!!error}
            helperText={error ? error.message : null}
          />
        </>
      )}
    />
  );
}

export { ControlledTextField };

ControlledTextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  focused: PropTypes.bool,
  control: PropTypes.object,
  type: PropTypes.string,
};