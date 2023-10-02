import React from 'react';
import {
  FormControl, InputLabel, MenuItem, Select,
} from '@mui/material';
import { Controller } from 'react-hook-form';

function ControlledSelect({
  options,
  name,
  control,
  label,
}) {
  const generateSingleOptions = () => options.map((option) => (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ));
  return (
    <FormControl sx={{ mb: -1, mt: 1, mx: 1 }} size="small">
      <InputLabel shrink>{label}</InputLabel>
      <Controller
        render={({ field: { onChange, value } }) => (
          <Select onChange={onChange} value={value} InputLabelProps={{ shrink: true }} fullWidth>
            {generateSingleOptions()}
          </Select>
        )}
        control={control}
        name={name}
      />
    </FormControl>
  );
}

export { ControlledSelect };
