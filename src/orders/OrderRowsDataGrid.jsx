/* eslint-disable import/no-unresolved */
import React, {
  useEffect, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  Button, Stack, Box,
} from '@mui/material';
import {
  DataGrid, ruRU, useGridApiRef,
} from '@mui/x-data-grid';
import config from 'config';
import {
  orderRowService, alertService,
// eslint-disable-next-line import/extensions
} from '@/_services';

const tepCode = `${config.tepCode}`;

function OrderRowsDataGrid({
  orderId, curRow, setCurRow, curRowSaved, setCurRowSaved, divisionCode,
}) {
  const rowColumns = [
    {
      field: 'sName',
      headerName: 'Наименование',
      width: 300,
      type: 'string',
      // eslint-disable-next-line no-nested-ternary
      valueGetter: (params) => `${((params.row.sProduct !== '...') ? `${params.row.sProduct}` : '')
        + ((params.row.sColor !== '...') ? ` ${params.row.sColor}` : '')
        + ((params.row.sLiner !== '...') ? ` Подкл.${params.row.sLiner}` : '')
        + ((params.row.sRant !== '...') ? ` Рант.${params.row.sRant}` : '')
        + ((params.row.sShpalt !== '...') ? `Шпал.${params.row.sShpalt}` : '')
        + ((params.row.size !== '0') ? ` р.${params.row.size}` : '')}`,
    },
    {
      field: 'number', type: 'number', headerName: 'Кол-во', headerAlign: 'center', width: 80,
    },
    {
      field: 'sContent',
      headerName: 'Атрибут...',
      width: 400,
      type: 'string',
      // eslint-disable-next-line no-nested-ternary
      valueGetter: (params) => `${((params.row.sVstavka !== '...') ? `Вст.${params.row.sVstavka}, ` : '')
        + ((params.row.sAshpalt !== '...') ? `${(divisionCode === tepCode) ? 'Шпал' : 'Крас'}.${params.row.sAshpalt}, ` : '')
        + ((params.row.sSpoyler !== '...') ? `${(divisionCode === tepCode) ? 'Спойл' : 'М1'}.${params.row.sSpoyler}, ` : '')
        + ((params.row.sGuba !== '...') ? `${(divisionCode === tepCode) ? 'Губа' : 'М2'}.${params.row.sGuba}, ` : '')
        + ((params.row.sKabluk !== '...') ? `${(divisionCode === tepCode) ? 'Кабл' : 'М3'}.${params.row.sKabluk}, ` : '')
        + ((params.row.sGelenok !== '...') ? `Гел.${params.row.sGelenok}, ` : '')
        + ((params.row.sSled !== '...') ? `След.${params.row.sSled}, ` : '')
        + ((params.row.sPyatka !== '...') ? `Пят.${params.row.sPyatka}, ` : '')
        + ((params.row.tert) ? 'Терт, ' : '')
        + ((params.row.sMatirovka !== '...') ? `Мат.${params.row.sMatirovka}, ` : '')
        + ((params.row.sPechat !== '...') ? `Печ.${params.row.sPechat}, ` : '')
        + ((params.row.sProshiv !== '...') ? `Прош.${params.row.sProshiv}, ` : '')
        + ((params.row.prodir) ? 'Продир, ' : '')
        + ((params.row.frez) ? 'Фрез, ' : '')
        + ((params.row.difersize) ? 'Полупара, ' : '')
        + ((params.row.attribute !== '') ? `Доп: ${params.row.attribute}` : '')}`,
    },

  ];
  const [loading, setLoading] = useState(false);
  const [orderRows, setOrderRows] = useState([]);
  const apiRef = useGridApiRef();

  if (curRow) {
    console.log('OrderRowsDataGrid curRow', curRow.sProduct + curRow.size + curRow.number);
  }
  console.log('OrderRowsDataGrid curRowSaved', curRowSaved);

  const fetchRows = useCallback(async () => {
    let curRowId = curRow.id;
    const rowsFetched = await orderRowService.getAll(orderId);
    if (rowsFetched.some) {
      setOrderRows(rowsFetched);
      apiRef.current.selectRow(curRowId);
      //setCurRow(rowsFetched[0] || orderRowService.getNew(orderId));
      console.log('OrderRowsDataGrid fetchRows curRow just has been set ', rowsFetched[0].sProduct + rowsFetched[0].size + rowsFetched[0].number);
    } else {
      setCurRow(orderRowService.getNew(orderId));
      console.log('OrderRowsDataGrid fetchRows curRow just has been set to new by orderId ->', orderId);
    }
    setCurRowSaved(false);
  }, [orderId, curRow]);
  useEffect(() => {
    console.log('OrderRowsDataGrid useEffect', curRow);
    fetchRows();
  }, [curRowSaved]);

  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const onRowsSelectionHandler = (ids) => {
    const selectedRowData = ids.map((id) => orderRows.find((row) => row.id === id));
    try {
      if (selectedRowData.some) {
        setRowSelectionModel(selectedRowData[0]);
        setCurRow(selectedRowData[0]);
        console.log('rowSelectionModel curRow just has been set ', selectedRowData[0].sProduct + selectedRowData[0].size + selectedRowData[0].number);
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
        setOrderRows(orderRows.map((x) => {
          // eslint-disable-next-line no-param-reassign
          if (x.id === row.id) { x.isDeleting = true; }
          return x;
        }));
        orderRowService.delete(row.id).then(() => {
          setOrderRows((s) => s.filter((x) => x.id !== row.id));
          if (orderRows.some) {
            setCurRow(orderRows[0]);
            console.log('delRow curRow just has been set ', orderRows[0].sProduct + orderRows[0].size + orderRows[0].number);
            apiRef.current.selectRow(orderRows[0].id);
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
            apiRef={apiRef}
            rowSelectionModel={rowSelectionModel}
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

// eslint-disable-next-line import/prefer-default-export
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
