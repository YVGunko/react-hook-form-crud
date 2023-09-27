import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Paper, Button, Divider, Typography, Stack, Box,
} from '@mui/material';
import { DataGrid, ruRU } from '@mui/x-data-grid';
import {
  orderRowService,
} from '@/_services';

const rowColumns = [
  {
    field: 'id',
    headerName: '#',
    type: 'string',
    width: 20,
    editable: false,
  },
  {
    field: 'sProduct', type: 'string', headerName: 'Наименование', headerAlign: 'center', width: 200,
  },
  {
    field: 'size', type: 'string', headerName: 'Размер', headerAlign: 'center', width: 50,
  },
  {
    field: 'sColor', headerName: 'Цвет', headerAlign: 'center', width: 120,
  },
  {
    field: 'sRant', headerName: 'Рант', headerAlign: 'center', width: 120,
  },
  {
    field: 'sLiner', headerName: 'Подклада', headerAlign: 'center', width: 120,
  },
  {
    field: 'attribute', headerName: 'Содежание...', headerAlign: 'center', width: 240,
  },
];

function OrderRowsDataGrid({ props }) {
  const [loading, setLoading] = useState(false);
  const [orderRows, setOrderRows] = useState([]);
  const fetchRows = useCallback(async () => {
    const rowsFetched = await orderRowService.getAll(props.orderId);
    setOrderRows(rowsFetched);
  }, []);
  useEffect(() => {
    console.log('OrderRowsDataGrid useEffect fetchRows');
    fetchRows();
  }, [props]);

  return (
    <Box sx={{
      height: '100%',
      width: '100%',
    }}
    >
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <DataGrid
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          rows={orderRows || []}
          columns={rowColumns}
          autoHeight
          loading={loading}
          enablePagination={false}
        />
      </Stack>
    </Box>
  );
}

export { OrderRowsDataGrid };