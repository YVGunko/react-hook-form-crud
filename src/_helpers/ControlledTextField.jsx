import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import { Divider } from '@mui/material';

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
        <>
          <Grid item xs={1}>
            <Divider light orientation="vertical" />
          </Grid>
          <TextField
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
        </>
      )}
    />
  );
}

export { ControlledTextField };
