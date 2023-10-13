/* eslint-disable max-len */
import React from 'react';
import {
  Checkbox, FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ThemeFormControlLabel = styled(FormControlLabel)(
  ({ theme }) => ({
    alignItems: 'center',
    color: theme.palette.grey[900],
    padding: theme.spacing(1),
    textAlign: 'center',
    ...theme.typography.body2,
    height: 30,
    lineHeight: '30px',
    verticalAlign: 'middle',
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
