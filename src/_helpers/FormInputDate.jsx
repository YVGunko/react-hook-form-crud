import React from 'react';
import { AdapterDateFns } from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab/LocalizationProvider';
import { DatePicker } from '@mui/lab/DatePicker';

function FormInputDate({ name, label }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      name=
      {name}
      render=
      {({ field: { onChange, value } }) => (
        <DatePicker value={value} onChange={onChange} />
      )}
    </LocalizationProvider>
  );
}
export { FormInputDate };
