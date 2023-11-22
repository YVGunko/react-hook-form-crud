/* eslint-disable max-len */
import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  DataGrid, ruRU, useGridApiRef,
} from '@mui/x-data-grid';
import {
  Tooltip, Divider, Box, IconButton, Paper,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import { styled } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';

import { orderService, alertService, tokenService } from '@/_services';
import { SelectBox, JoyCheckBox, isString } from '@/_helpers';
import { defaultListFormValues, defaultDates, getFromTo } from './defaultValues';
import { NO_FILIAL_COLUMNS, ALL_COLUMNS } from './columns';
import { setGridState, gridState } from './order.grid.service';

function List({ match }) {
  const { path } = match;
  const history = useHistory();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const token = tokenService.get();
  const apiRef = useGridApiRef();
  const {
    control,
    formState: {
      isSubmitting,
    },
    handleSubmit,
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
  function editOrder(event, row) {
    setGridState(apiRef.current.exportState());
    history.push({ pathname: `${path}/edit/${row.id}`, state: { copy: 'edit' } });
  }
  function copyAndOpenAsNew(event, row) {
    setGridState(apiRef.current.exportState());
    try {
      setIsLoading(true);
      if (row?.user_id !== token.id) row.user_id = token.id;
      orderService.copy(row)
        .then((data) => {
          alertService.success('Заказ скопирован.', { keepAfterRouteChange: true });
          history.push({ pathname: `${path}/edit/${data.id}`, state: { copy: 'copy' } });
        })
        .catch(alertService.error);
    } finally {
      setIsLoading(false);
    }
  }
  function deleteOrder(event, row) {
    if (window.confirm('Удалить безвозвратно? Уверены?')) {
      try {
        setIsLoading(true);
        setOrders(orders.map((x) => {
          if (x.id === row.id) { x.isDeleting = true; }
          return x;
        }));
        orderService.delete(row.id).then(() => {
          setOrders((s) => s.filter((x) => x.id !== row.id));
        });
      } finally {
        setIsLoading(false);
      }
    }
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
        <IconButton onClick={(event) => editOrder(event, row)} size="small">
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
    console.log('onPaginationModelChange -> ', paginationModelL);
    setPaginationModel({ page: paginationModelL.page, pageSize: paginationModelL.pageSize });
  }
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const onRowsSelectionHandler = useMemo(() => (ids) => {
    const selOrderData = ids.map((id) => orders.find((row) => row.id === id));
    try {
      setRowSelectionModel(selOrderData[0]);
    } catch {
      console.log('rowSelectionModel exception!');
    }
  }, [orders]);
  // DataGrid helpers

  const fetchData = useCallback(async (data) => {
    try {
      const isUser = data.isUser || defaultListFormValues.isUser;
      const from = data.defaultDates ? getFromTo(data.defaultDates).from : getFromTo(defaultListFormValues.defaultDates).from;
      const to = data.defaultDates ? getFromTo(data.defaultDates).to : getFromTo(defaultListFormValues.defaultDates).to;
      setIsLoading(true);
      const ordersFetched = await orderService.getAll(from, to, isUser, data.customer_id, data.division_code);
      setOrders(ordersFetched);
    } finally { 
      setIsLoading(false); 
      try {
        if (typeof gridState === 'object' && gridState !== null) {
          console.log('gridState restoreState ', gridState);
          apiRef.current.restoreState(gridState);
        }
      } catch {
        console.log('gridState restoreState catch');
      }
    }
  }, []);
  useEffect(() => {
    console.log('useEffect -> ', defaultListFormValues);
    fetchData(defaultListFormValues);
  }, []);

  function onSubmit(data) {
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
          <IconButton component={Link} to={{ pathname: `${path}/add`, state: { copy: 'add' } }} disabled={isSubmitting}>
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
                <JoyCheckBox
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
            apiRef={apiRef}
            gridPageCountSelector
            pageSizeOptions={[10]}
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
            autoHeight
            loading={isLoading || isSubmitting}
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

List.propTypes = {
  match: PropTypes.object.isRequired, 
  path: PropTypes.string,
};