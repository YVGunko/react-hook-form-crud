/* eslint-disable max-len */
import React from 'react';
import {
  Checkbox, Paper, FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ThemeFormControlLabel = styled(FormControlLabel)(
  ({ theme }) => ({
    color: theme.palette.grey[900],
    padding: theme.spacing(2),
    textAlign: 'center',
    ...theme.typography.h6,
    height: 50,
    lineHeight: '50px',
  }),
);

function CheckBox({
  onChange, value, label, isDisabled, isRequired, theme,
}) {
  return (
    <ThemeFormControlLabel
      theme={theme}
      control={
        <Checkbox checked={value || false} onChange={onChange} disabled={isDisabled} required={isRequired} />
      }
      label={label}
    />
  );
}

export { CheckBox };
