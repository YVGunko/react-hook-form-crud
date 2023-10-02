import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

function ControlledTextField({ name, control, label }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <TextField sx={{ mb: -1, mt: 1}}
          helperText={error ? error.message : null}
          size="small"
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
        />
      )}
    />
  );
}

export {ControlledTextField};
