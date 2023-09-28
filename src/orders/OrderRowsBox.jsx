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

const buttons = [
  {
    title: 'Добавить',
    action: () => { alert('Button1'); },
  },
  {
    title: 'Скопировать',
    action: () => { alert('Button2'); },
  },
];
const ButtonRow = () => {
  const buttonRow = buttons.map(
    (button) => (<Button className="button" onClick={button.action}>{button.title}</Button>),
  );
  return buttonRow;
};
function OrderRowsBox({ orderId, divisionCode }) {
  const [curRow, setCurRow] = useState({});
  const [curRowChanged, setCurRowChanged] = useState(false);
  return (
    <Grid container className="content" spacing={1} justify="center">
      <Divider />
      <Grid item md={8} xs={6}>

        <ButtonRow />
        <Divider />
        <OrderRowsDataGrid orderId={orderId} setCurRow={setCurRow} />
      </Grid>
      <Grid item md={4} xs={6}>
        <RowAddEdit
          divisionCode={divisionCode}
          curRow={curRow}
          setCurRowChanged={setCurRowChanged}
        />
      </Grid>
    </Grid>
  );
}

export { OrderRowsBox };

OrderRowsBox.propTypes = {
  orderId: PropTypes.string.isRequired,
  divisionCode: PropTypes.string.isRequired,
};