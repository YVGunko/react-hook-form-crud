import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  Button, Divider, Typography, Stack, Box,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { DataGrid, ruRU } from '@mui/x-data-grid';
import config from 'config';
import {
  orderRowService, alertService,
} from '@/_services';

const tepCode = `${config.tepCode}`;

function OrderRowsDataGrid({
  orderId, curRow, setCurRow, curRowChanged, setCurRowChanged, divisionCode,
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
  console.log('OrderRowsDataGrid orderRows', orderRows);
  console.log('OrderRowsDataGrid curRow', curRow);
  console.log('OrderRowsDataGrid curRowChanged', curRowChanged);
  const fetchRows = useCallback(async () => {
    const rowsFetched = await orderRowService.getAll(orderId);
    setOrderRows(rowsFetched);
    setCurRow(rowsFetched[0] || orderRowService.getNew(orderId));
    setCurRowChanged(false);
    console.log('OrderRowsDataGrid fetchRows curRow', curRow);
  }, [orderId, curRow]);
  useEffect(() => {
    console.log('OrderRowsDataGrid useEffect', curRow);
    fetchRows();
  }, [curRowChanged]);
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
  function createRow(payload) {
    return orderRowService.create(payload)
      .then((data) => {
        console.log('orderRowService.create data=', data);
        fetchRows();
      })
      .catch(alertService.error);
  }
  function copyRow(payload) {
    return orderRowService.copy(payload)
      .then((data) => {
        console.log('orderRowService.create data=', data);
        fetchRows();
      })
      .catch(alertService.error);
  }
  function copyRowSizeUp(payload) {
    return orderRowService.copySizeUp(payload)
      .then((data) => {
        console.log('orderRowService.create data=', data);
        fetchRows();
      })
      .catch(alertService.error);
  }
  const buttons = [
    {
      title: 'Добавить',
      action: () => { createRow(orderRowService.getNew(orderId)); },
      color: 'primary',
    },
    {
      title: 'Скопировать',
      action: () => { copyRow(curRow); },
      color: 'secondary',
    },
    {
      title: 'Скопировать, размер+1 ',
      action: () => { copyRowSizeUp(curRow); },
      color: 'secondary',
    },
  ];
  const ButtonRow = () => {
    const buttonRow = buttons.map(
      (button) => (
        <Button
          variant="outlined"
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
            autoHeight
            loading={loading}
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
  curRow: PropTypes.array.isRequired,
  setCurRow: PropTypes.func.isRequired,
  curRowChanged: PropTypes.bool.isRequired,
};
