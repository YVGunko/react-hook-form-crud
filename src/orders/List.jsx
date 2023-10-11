/* eslint-disable max-len */
import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';

import { DataGrid, ruRU } from '@mui/x-data-grid';
import {
  Tooltip, Button, Divider, Typography, Stack, Box, ButtonGroup, IconButton, Paper,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import { styled } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';

import { orderService, alertService, tokenService } from '@/_services';
import { SelectBox, CheckBox, isString } from '@/_helpers';
import { defaultListFormValues, defaultDates, getFromTo } from './defaultValues';
import { NO_FILIAL_COLUMNS, ALL_COLUMNS } from './columns';

function List({ match }) {
  const { path } = match;
  const history = useHistory();
  const [orders, setOrders] = useState([]);
  const token = tokenService.get();
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
  // func used in rows
  async function sendOrderByEmail(event, row) {
    event.stopPropagation();
    await orderService.sendMail(row.id)
      .then(() => {
        alertService.success('Заказ отправлен.', { keepAfterRouteChange: true });
      })
      .catch(alertService.error);
  }
  function copyAndOpenAsNew(event, row) {
    // event.stopPropagation();

    orderService.copy(row)
      .then((data) => {
        console.log('copyAndOpenAsNew then data', data);
        alertService.success('Заказ скопирован.', { keepAfterRouteChange: true });
        history.push(`${path}/edit/${data.id}`);
      })
      .catch(alertService.error);
  }
  function deleteOrder(event, row) {
    setOrders(orders.map((x) => {
      if (x.id === row.id) { x.isDeleting = true; }
      return x;
    }));
    orderService.delete(row.id).then(() => {
      setOrders((orders) => orders.filter((x) => x.id !== row.id));
    });
  }
  //
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
            <ContentCopyOutlinedIcon color="action" />
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
        <IconButton onClick={(event) => sendOrderByEmail(event, row)} size="small" disabled={row ? !isString(row.details) : false}>
          <Tooltip id="button-send" title="Отправить по email">
            <EmailOutlinedIcon />
          </Tooltip>
        </IconButton>
      ),
    },
    {
      field: 'del',
      width: 40,
      headerName: '',
      sortable: false,
      renderCell: ({ row }) => (
        <IconButton onClick={(event) => deleteOrder(event, row)} size="small" disabled={row ? isString(row.details) : false}>
          <Tooltip id="button-del" title="Удалить безвозвратно">
            <DeleteForeverOutlinedIcon />
          </Tooltip>
        </IconButton>
      ),
    },
  ];
  const [columnVisible, setColumnVisible] = React.useState(ALL_COLUMNS);
  React.useEffect(() => {
    const newColumns = token.filial_id === '0' ? ALL_COLUMNS : NO_FILIAL_COLUMNS;
    setColumnVisible(newColumns);
  }, [token.filial_id]);
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
    const ordersFetched = await orderService.getAll(from, to, isUser, data.customer_id, data.division_code);
    setOrders(ordersFetched);
  }, []);
  useEffect(() => {
    console.log('useEffect ', defaultListFormValues);
    fetchData(defaultListFormValues);
  }, []);

  const preventDefault = (event, row) => {
    event.preventDefault();
  };

  function onSubmit(data) {
    console.log('onSubmit, data ', data);
    return fetchData(data);
  }
  // JSX
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.h6,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
        width: '100%',
        '& > div': {
          overflow: 'auto hidden',
          '&::-webkit-scrollbar': { height: 10, WebkitAppearance: 'none' },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            border: '2px solid',
            borderColor: theme.palette.mode === 'dark' ? '' : '#E7EBF0',
            backgroundColor: 'rgba(0 0 0 / 0.5)',
          },
        },
      })}
    >
      <Grid
        container
        spacing={2}
        sx={{ mb: 1 }}
        alignItems="center"
      >
        <Grid item xs={2}>
          <Item>Заказы</Item>
        </Grid>
        <Grid item xs={1} justifyContent="flex-end">
          <IconButton component={Link} to={`${path}/add`} disabled={isSubmitting}>
            <Tooltip id="button-add" title="Создать заказ">
              <AddCardOutlinedIcon />
            </Tooltip>
          </IconButton>
        </Grid>
        <Grid item xs={2}>
          <Divider orientation="vertical" color="primary">За период:</Divider>
        </Grid>
        <Grid item xs={3}>
          <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            {defaultDates && (
              <Controller
                name="defaultDates"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SelectBox
                    rows={defaultDates}
                    onChange={onChange}
                    value={value}
                    isDisabled={isSubmitting}
                  />
                )}
              />
            )}
          </form>
        </Grid>
        <Grid item xs={2}>
          <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            <Controller
              name="isUser"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CheckBox
                  onChange={onChange}
                  value={value}
                  label="Только мои"
                  isDisabled={isSubmitting}
                />
              )}
            />
          </form>
        </Grid>
        <Grid item xs={1}>
          <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            <IconButton type="submit" disabled={isSubmitting}>
              <Tooltip id="button-refresh" title="Обновить">
                <RefreshOutlinedIcon />
              </Tooltip>
            </IconButton>
          </form>
        </Grid>

        <Box sx={{
          height: '100%',
          width: '100%',
        }}
        >
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
            columnVisibilityModel={columnVisible}
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
        </Box>
      </Grid>
    </Box>
  );
}

export { List };
