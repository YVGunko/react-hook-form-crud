import React, { useState, } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Box,
} from '@mui/material';

import { OrderRowsDataGrid } from './OrderRowsDataGrid';
import { RowAddEdit } from './RowAddEdit';

function OrderRowsBox({ orderId, divisionCode }) {
  const [curRow, setCurRow] = useState({});
  const [curRowSaved, setCurRowSaved] = useState(false);
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid container item sm={8}>
          {orderId && divisionCode && (
          <OrderRowsDataGrid
            orderId={orderId}
            curRow={curRow}
            setCurRow={setCurRow}
            curRowSaved={curRowSaved}
            setCurRowSaved={setCurRowSaved}
            divisionCode={divisionCode}
          />
          )}
        </Grid>
        <Grid container item sm={4}>
          {orderId && divisionCode && (
          <RowAddEdit
            divisionCode={divisionCode}
            curRow={curRow}
            setCurRow={setCurRow}
            setCurRowSaved={setCurRowSaved}
          />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export { OrderRowsBox };

OrderRowsBox.propTypes = {
  orderId: PropTypes.string,
  divisionCode: PropTypes.string,
};
