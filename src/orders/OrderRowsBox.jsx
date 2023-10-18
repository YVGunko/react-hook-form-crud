import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Paper, Button, Divider, Typography, Stack, Box,
} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

import { OrderRowsDataGrid } from './OrderRowsDataGrid';
import { RowAddEdit } from './RowAddEdit';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));

const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

function OrderRowsBox({ orderId, divisionCode }) {
  const [curRow, setCurRow] = useState({});
  const [curRowSaved, setCurRowSaved] = useState(false);
  console.log('OrderRowsBox setCurRowSaved', curRowSaved);
  console.log('OrderRowsBox curRow', curRow);
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid container item sm={8}>
          <OrderRowsDataGrid
            orderId={orderId}
            curRow={curRow}
            setCurRow={setCurRow}
            curRowSaved={curRowSaved}
            setCurRowSaved={setCurRowSaved}
            divisionCode={divisionCode}
          />
        </Grid>
        <Grid container item sm={4}>
          <RowAddEdit
            divisionCode={divisionCode}
            curRow={curRow}
            setCurRow={setCurRow}
            setCurRowSaved={setCurRowSaved}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export { OrderRowsBox };

OrderRowsBox.propTypes = {
  orderId: PropTypes.string.isRequired,
  divisionCode: PropTypes.string.isRequired,
};
