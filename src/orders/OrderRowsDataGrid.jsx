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
  orderId, curRow, setCurRow, curRowSaved, setCurRowSaved, divisionCode, setIsRows,
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
      field: 'size', type: 'number', headerName: 'Разм', headerAlign: 'center', width: 80,
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
      rowsFetched[0] ? setIsRows(true) : setIsRows(false);
    } else {
      setCurRow(orderRowService.getNew(orderId));
      setIsRows(false);
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
            filtered[0] ? setIsRows(true) : setIsRows(false);
          } else {
            setIsRows(false);
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
      disabled: false
    },
    {
      title: 'Копировать',
      action: () => { copyRow(curRow); },
      color: 'secondary',
      disabled: !curRow?.id
    },
    {
      title: 'Копировать, размер+1',
      action: () => { copyRowSizeUp(curRow); },
      color: 'secondary',
      disabled: !curRow?.id
    },
    {
      title: 'Удалить',
      action: () => { delRow(curRow); },
      color: 'warning',
      disabled: !curRow?.id
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
          disabled={button.disabled}
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
            rowHeight={35}
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
  curRow: PropTypes.object,
  setCurRow: PropTypes.func.isRequired,
  setCurRowSaved: PropTypes.func.isRequired,
  curRowSaved: PropTypes.bool.isRequired,
  divisionCode: PropTypes.string.isRequired,
  setIsRows: PropTypes.func,
};
