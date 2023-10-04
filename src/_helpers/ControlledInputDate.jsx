import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';

function ControlledInputDate({ name, control, label }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <DatePicker value={value} onChange={onChange} />
      )}
    />
  );
}
export { ControlledInputDate };
