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

const ButtonRow = () => {
    const buttonRow = buttons.map(
      (button) => (<Button className="button" onClick={button.action}>{button.title}</Button>),
    );
    return buttonRow;
  };

const OrderRowsBox = ({ orderId }) => {
    return (
        <Grid container className="content" spacing={1} justify="center">
            <Grid item md={10} xs={12}>
                <ButtonRow />
                <Divider />
                <OrderRowsDataGrid orderId={orderId} />
            </Grid>
            <Grid item xs={1}>
                <Divider orientation="vertical" />
            </Grid>
            <Grid item md={7} xs={12}>
                {orderId}
            </Grid>
        </Grid>
    );
}

export { OrderRowsBox };