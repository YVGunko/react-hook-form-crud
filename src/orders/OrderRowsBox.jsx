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
  const [curRowChanged, setCurRowChanged] = useState(false);
  console.log('OrderRowsBox setCurRowChanged', curRowChanged);
  console.log('OrderRowsBox curRow', curRow);
  return (
    <Grid container className="content" spacing={1} justify="center">

      <OrderRowsDataGrid
        orderId={orderId}
        curRow={curRow}
        setCurRow={setCurRow}
      />
      <Grid item md={1} xs={1}>
        <Divider orientation="vertical" />
      </Grid>
      <RowAddEdit
        divisionCode={divisionCode}
        curRow={curRow}
        setCurRowChanged={setCurRowChanged}
      />
    </Grid>
  );
}

export { OrderRowsBox };

OrderRowsBox.propTypes = {
  orderId: PropTypes.string.isRequired,
  divisionCode: PropTypes.string.isRequired,
};
