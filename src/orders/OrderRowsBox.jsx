import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Paper, Button, Divider, Typography, Stack, Box,
} from '@mui/material';

import { OrderRowsDataGrid } from './OrderRowsDataGrid';

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
function Column(props) {
  return (
    <Paper className="column">
      <h2>{props.title}</h2>
      <p>{props.children}</p>
    </Paper>
  );
}
const ButtonRow = () => {
  const buttonRow = buttons.map(
    (button) => (<Button className="button" onClick={button.action}>{button.title}</Button>),
  );
  return buttonRow;
};

function OrderRowsBox({ orderId }) {
  return (
    <Grid container className="content" spacing={1} justify="center">
      <Grid item md={6} xs={12}>
        <ButtonRow />
        <Divider />
        <OrderRowsDataGrid orderId={orderId} />
      </Grid>
      <Grid item md={6} xs={12}>
        <Column title="Строки заказа: ">
          {orderId}
          {orderId}
        </Column>
      </Grid>
    </Grid>
  );
}

export { OrderRowsBox };