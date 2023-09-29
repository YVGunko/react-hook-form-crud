import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Paper, Button, Divider, Typography, Stack, Box,
} from '@mui/material';
import { DataGrid, ruRU } from '@mui/x-data-grid';
import {
  orderRowService, alertService,
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

function OrderRowsDataGrid({ orderId, curRow, setCurRow }) {
  const [loading, setLoading] = useState(false);
  const [orderRows, setOrderRows] = useState([]);
  console.log('OrderRowsDataGrid orderRows', orderRows);
  const fetchRows = useCallback(async () => {
    const rowsFetched = await orderRowService.getAll(orderId);
    setOrderRows(rowsFetched);
    setCurRow(rowsFetched[0]);
  }, [orderId]);
  useEffect(() => {
    fetchRows();
  }, []);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const onRowsSelectionHandler = (ids) => {
    const selectedRowData = ids.map((id) => orderRows.find((row) => row.id === id));
    try {
      setRowSelectionModel(selectedRowData[0]);
      setCurRow(selectedRowData[0]);
    } catch {
      console.log('rowSelectionModel exception!');
    }
  };
  function createRow(e) {
    return orderRowService.create(e)
      .then(() => {
//TODO
      })
      .catch(alertService.error);
  }
  const buttons = [
    {
      title: 'Добавить',
      action: () => { createRow(''); },
      color: 'primary',
    },
    {
      title: 'Скопировать',
      action: () => { createRow(curRow.id); },
      color: 'secondary',
    },
  ];
  const ButtonRow = () => {
    const buttonRow = buttons.map(
      (button) => (
        <Button
          color={button.color}
          onClick={button.action}
        >
          {button.title}
        </Button>
      ),
    );
    return buttonRow;
  };
  return (
    <Grid item md={8} xs={6}>
      <ButtonRow />
      <Divider />
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
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
          />
        </Stack>
      </Box>
    </Grid>
  );
}

export { OrderRowsDataGrid };

OrderRowsDataGrid.propTypes = {
  orderId: PropTypes.string.isRequired,
  setCurRow: PropTypes.func.isRequired,
};
