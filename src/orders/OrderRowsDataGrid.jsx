import React, {
  useEffect, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  Button, Stack, Box,
} from '@mui/material';
import {
  DataGrid, ruRU,
} from '@mui/x-data-grid';
import {
  orderRowService, alertService,
} from '@/_services';
import {
  getRowNameText, getRowAttributeText, } from './order.grid.service';

function OrderRowsDataGrid({
  orderId, curRow, setCurRow, curRowSaved, setCurRowSaved, divisionCode,
}) {
  const rowColumns = [
    {
      field: 'sName',
      headerName: 'Наименование',
      width: 300,
      type: 'string',
      valueGetter: (params) => getRowNameText(params)
    },
    {
      field: 'number', type: 'number', headerName: 'Кол-во', headerAlign: 'center', width: 80,
    },
    {
      field: 'sContent',
      headerName: 'Атрибут...',
      width: 400,
      type: 'string',
      valueGetter: (params) => getRowAttributeText(params, divisionCode)
    },

  ];
  const [loading, setLoading] = useState(false);
  const [orderRows, setOrderRows] = useState([]);

  const fetchRows = useCallback(async () => {
    const rowsFetched = await orderRowService.getAll(orderId);
    if (rowsFetched.some) {
      setOrderRows(rowsFetched);
      setCurRow(rowsFetched[0]);
    } else {
      setCurRow(orderRowService.getNew(orderId));
    }
    setCurRowSaved(false);
  }, [orderId, curRow]);
  useEffect(() => {
    fetchRows();
  }, [curRowSaved]);

  const onRowsSelectionHandler = (ids) => {
    const selectedRowData = ids.map((id) => orderRows.find((row) => row.id === id));
    try {
      if (selectedRowData.some) {
        setCurRow(selectedRowData[0]);
      }
    } catch {
      console.log('rowSelectionModel exception!');
    }
  };
  /* row act funcs */
  function createRow(payload) {
    return orderRowService.create(payload)
      .then(() => {
        fetchRows();
      })
      .catch(alertService.error);
  }
  function copyRow(payload) {
    return orderRowService.copy(payload)
      .then(() => {
        fetchRows();
      })
      .catch(alertService.error);
  }
  function copyRowSizeUp(payload) {
    return orderRowService.copySizeUp(payload)
      .then(() => {
        fetchRows();
      })
      .catch(alertService.error);
  }
  function delRow(row) {
    if (!row?.id) {
      alertService.warn('Выберите строку для удаления.', { keepAfterRouteChange: false });
      return;
    }
    if (window.confirm('Удалить безвозвратно? Уверены?')) {
      try {
        setLoading(true);
        orderRowService.delete(row.id).then(() => {
          const filtered = orderRows.filter((orderRow) => orderRow.id !== row.id);
          if (filtered.some) {
            setCurRow(filtered[0]);
            setOrderRows(filtered);
          }
        });
      } finally {
        setLoading(false);
      }
    }
  }
  const buttons = [
    {
      title: 'Добавить',
      action: () => { createRow(orderRowService.getNew(orderId)); },
      color: 'primary',
    },
    {
      title: 'Копировать',
      action: () => { copyRow(curRow); },
      color: 'secondary',
    },
    {
      title: 'Копировать, размер+1',
      action: () => { copyRowSizeUp(curRow); },
      color: 'secondary',
    },
    {
      title: 'Удалить',
      action: () => { delRow(curRow); },
      color: 'warning',
    },
  ];
  const ButtonRow = () => {
    const buttonRow = buttons.map(
      (button) => (
        // eslint-disable-next-line react/jsx-key
        <Button
          variant="outlined"
          color={button.color}
          onClick={button.action}
          disabled={!orderId}
        >
          {button.title}
        </Button>
      ),
    );
    return buttonRow;
  };
  return (
    <>
      <Stack direction="row" spacing={2}>
        <ButtonRow />
      </Stack>
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
            pageSizeOptions={[12]}
            autoHeight
            loading={loading}
            rowSelectionModel={curRow?.id}
            onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 12 },
              },
            }}
            sx={{
              boxShadow: 2,
              border: 2,
              borderColor: 'primary.light',
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-cell:focus-within': {
                outline: 'none',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'primary.light',
                fontSize: 16,
                width: '100%',
              },
            }}
          />
        </Stack>
      </Box>
    </>
  );
}

export { OrderRowsDataGrid };

OrderRowsDataGrid.propTypes = {
  orderId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  curRow: PropTypes.array.isRequired,
  setCurRow: PropTypes.func.isRequired,
  setCurRowSaved: PropTypes.func.isRequired,
  curRowSaved: PropTypes.bool.isRequired,
  divisionCode: PropTypes.string.isRequired,
};
