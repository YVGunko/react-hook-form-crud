import React from 'react';
import { Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const ThemeDivider = styled(Divider)(
  ({ theme }) => ({
    color: theme.palette.grey[900],
    padding: theme.spacing(2),
    textAlign: 'center',
    variant: 'middle',
    lineHeight: '500px',
  }),
);

function DividerVert({ theme }) {
  return (
    <ThemeDivider theme={theme} orientation="vertical" flexItem />
  );
}

export { DividerVert };
