/* eslint-disable max-len */
import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { Link } from 'react-router-dom';

import { DataGrid, ruRU } from '@mui/x-data-grid';
import {
  Tooltip, Button, Divider, Typography, Stack, Box, ButtonGroup, IconButton, Grid,
} from '@mui/material';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { styled } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';

import { orderService, alertService } from '@/_services';
import { SelectBox, CheckBox, DividerVert } from '@/_helpers';
import { defaultListFormValues, defaultDates, getFromTo } from './defaultValues';

function List({ match }) {
  const { path } = match;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    register,
    control,
    formState: {
      errors, isSubmitting, isDirty, dirtyFields,
    },
    handleSubmit,
    getValues,
    reset,
  } = useForm(
    {
      values: defaultListFormValues,
    },
  );
  const columnsForDataGrid = [
    {
      field: 'sample',
      headerName: 'Обр.',
      type: 'boolean',
      width: 50,
      editable: false,
      renderCell: (params) => (params.value ? (
        <VerifiedOutlinedIcon />
      ) : <></>),
    },
    {
      field: 'id', type: 'string', headerName: '№ заказа', headerAlign: 'center', width: 100, headerClassName: 'super-app-theme--header',
    },
    {
      field: 'date', type: 'Date', headerName: 'Дата', headerAlign: 'center', width: 120, headerClassName: 'super-app-theme--header',
    },
    {
      field: 'customer_name', headerName: 'Клиент', headerAlign: 'center', width: 120, headerClassName: 'super-app-theme--header',
    },
    {
      field: 'division_name', headerName: 'Подразделение', headerAlign: 'center', width: 120, headerClassName: 'super-app-theme--header',
    },
    {
      field: 'comment', headerName: 'Филиал', headerAlign: 'center', width: 140, headerClassName: 'super-app-theme--header',
    },
    {
      field: 'details', headerName: 'Содежание...', headerAlign: 'center', width: 240, headerClassName: 'super-app-theme--header',
    },
    {
      field: 'edit',
      width: 40,
      headerName: '',
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: ({ row }) => (
        <IconButton component={Link} to={`${path}/edit/${row.id}`} size="small">
          <Tooltip id="button-edit" title="Редактировать">
            <EditOutlinedIcon />
          </Tooltip>
        </IconButton>
      ),
    },
    {
      field: 'copy',
      width: 40,
      headerName: '',
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: ({ row }) => (
        <IconButton onClick={(event) => copyAndOpenAsNew(event, row)} size="small">
          <Tooltip id="button-copy" title="Копировать">
            <ContentCopyOutlinedIcon />
          </Tooltip>
        </IconButton>
      ),
    },
    {
      field: 'send',
      width: 40,
      headerName: '',
      sortable: false,
      renderCell: ({ row }) => (
        <IconButton onClick={(event) => sendOrderByEmail(event, row)} size="small">
          <Tooltip id="button-send" title="Отправить по email">
            <EmailOutlinedIcon />
          </Tooltip>
        </IconButton>
      ),
    },

  ];
  // DataGrid helpers
  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 10 });
  function onPaginationModelChange(paginationModelL) {
    setPaginationModel({ page: paginationModelL.page, pageSize: paginationModelL.pageSize });
  }

  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const onRowsSelectionHandler = useMemo(() => (ids) => {
    const selOrderData = ids.map((id) => orders.find((row) => row.id === id));
    console.log(`rowSelectionModel ${JSON.stringify(selOrderData[0])}`);
    try {
      setRowSelectionModel(selOrderData[0]);
    } catch {
      console.log('rowSelectionModel exception!');
    }
  }, [orders]);
  // DataGrid helpers

  const fetchData = useCallback(async (data) => {
    const isUser = data.isUser || defaultListFormValues.isUser;
    const from = data.defaultDates ? getFromTo(data.defaultDates).from : getFromTo(defaultListFormValues.defaultDates).from;
    const to = data.defaultDates ? getFromTo(data.defaultDates).to : getFromTo(defaultListFormValues.defaultDates).to;
    const ordersFetched = await orderService.getAll(isUser, from, to);
    setOrders(ordersFetched);
  }, []);
  useEffect(() => {
    console.log('useEffect ', defaultListFormValues);
    fetchData(defaultListFormValues);
  }, []);

  const preventDefault = (event, row) => {
    event.preventDefault();
  };

  function sendOrderByEmail(event, row) {
    event.stopPropagation();
    return alert(JSON.stringify(row, null, 4));
  }
  function copyAndOpenAsNew(event, row) {
    event.stopPropagation();
    return alert(JSON.stringify(row, null, 4));
  }
  function deleteOrder(id) {
    setOrders(orders.map((x) => {
      if (x.id === id) { x.isDeleting = true; }
      return x;
    }));
    orderService.delete(id).then(() => {
      setOrders((orders) => orders.filter((x) => x.id !== id));
    });
  }
  function onSubmit(data) {
    if (!isDirty) {
      alertService.warn('Заказ не изменен. Нечего сохранять ;) ', { keepAfterRouteChange: true });
      console.log('onSubmit -> isDirty', isDirty);
      return true;
    }
    console.log('onSubmit -> isDirty', data);
    return fetchData(data);
  }
  // JSX
  return (
    <Grid container spacing={2} sx={{ mb: 1 }}>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <h1>Заказы</h1>

        <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
          <Grid container spacing={2} sx={{ mb: 2, ml: 2 }}>
            <Grid item md={12} xs={12}>
              {defaultDates && (
                <Controller
                  name="defaultDates"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SelectBox
                      rows={defaultDates}
                      onChange={onChange}
                      value={value}
                      desc="За период: "
                    />
                  )}
                />
              )}
            </Grid>
            <Button type="submit" variant="outlined" disabled={isSubmitting} color="success" sx={{ mt: 1, mx: 1 }}>
              {isSubmitting && <span className="spinner-border spinner-border-sm mr-1" />}
              Сохранить
            </Button>
          </Grid>
        </form>

        <Button component={Link} to={`${path}/add`} variant="outlined" disabled={loading} color="primary">
          Добавить
        </Button>

      </Stack>

      <Box sx={{
        height: '100%',
        width: '100%',
        '& .super-app-theme--header': {
          backgroundColor: 'primary.light',
        },

      }}
      >
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <DataGrid
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            rows={orders || []}
            columns={columnsForDataGrid}
            gridPageCountSelector
            pageSizeOptions={[10]}
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
            autoHeight
            loading={isSubmitting}
          />
        </Stack>
      </Box>

    </Grid>
  );
}

export { List };
