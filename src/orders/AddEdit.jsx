import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid, Paper, Button, Divider, Typography, Stack, Box,
} from '@mui/material';
import { DataGrid, ruRU } from '@mui/x-data-grid';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import {
  userService, orderService, orderRowService, divisionService, alertService, customerService, filialService,
} from '@/_services';
// eslint-disable-next-line import/extensions
import { SelectBox, CheckBox } from '@/_helpers';
import { OrderContent } from './Content';

function AddEdit({ history, match }) {
  const { id } = match.params;
  const isAddMode = !id;

  const [users, setUsers] = useState([]);
  const fetchUsers = useCallback(async () => {
    const rawUsers = await userService.getAll();
    setUsers(rawUsers.map((item) => ({
      value: item.id,
      label: item.username,
    })));
    console.log('fetchUsers ');
  }, []);

  const [filials, setFilials] = useState([]);
  const fetchFilials = useCallback(async () => {
    const rawFilials = await filialService.getAll();
    setFilials(rawFilials.map((item) => ({
      value: item.filial_name,
      label: item.filial_name,
    })));
    console.log('fetchFilials ');
  }, []);

  const [divisions, setDivisions] = useState([]);
  const fetchDivisions = useCallback(async () => {
    const rawDivisions = await divisionService.getAll();
    setDivisions(rawDivisions.map((item) => ({
      value: item.division_code,
      label: item.division_name,
    })));
    console.log('fetchDivisions ');
  }, []);

  const [customers, setCustomers] = useState([]);
  const fetchCustomers = useCallback(async () => {
    const rawCustomers = await customerService.getAll();
    setCustomers(rawCustomers.customers.map((item) => ({
      value: item.id,
      label: item.name,
    })));
    console.log('fetchCustomers ');
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchUsers();
    fetchDivisions();
    fetchFilials();
  }, []);

  const validationSchema = Yup.object().shape({
    id: Yup.string()
      .required('Номер заказа должен быть заполнен!'),
    date: Yup.string()
      .required('Дата заказа должна быть установлена!'),
    customer_id: Yup.string()
      .required('Клиента необходимо выбрать!'),
    division_code: Yup.string()
      .required('Подразделение необходимо выбрать!'),
    division_name: Yup.string()
      .required('Подразделение необходимо выбрать!'),
    user_id: Yup.string()
      .required('Пользователь должен быть установлен!'),
  });

  /* functions to build form returned by useForm() hook
  const {
    register, handleSubmit, reset, setValue, errors, formState,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
*/
  // data fetch
  async function fetchOrder(orderId) {
    let x = {};
    if (isAddMode) {
      x = orderService.getNew();
    } else {
      x = await orderService.getById(orderId);
    }
    console.log(`fetchOrder ${JSON.stringify(x)}`);
    return x;
  }
  const fetchData = useCallback(async () => {
    console.log(`useCallback ${JSON.stringify(paginationModel)}`);
    const ordersFetched = await orderRowService.getAll(
      '',
      '',
      paginationModel?.page ? paginationModel.page : 0,
      paginationModel?.pageSize ? paginationModel.pageSize : 10,
    );
    setOrders(ordersFetched.orders);
    setTotalItems(ordersFetched.totalItems);
  }, [paginationModel]);
  useEffect(() => {
    console.log('useEffect ');
    fetchData();
  }, [paginationModel]);
  // data fetch end
  // form init
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
    { defaultValues: async () => fetchOrder(id) },
  );

  const handleChange = (e) => {
    console.log(e);
  };
  function createOrder(data) {
    return orderService.create(data)
      .then(() => {
        alertService.success('Новый заказ создан', { keepAfterRouteChange: true });
        history.push('.');
      })
      .catch(alertService.error);
  }

  function updateOrder(id, data) {
    return orderService.update(id, data)
      .then(() => {
        alertService.success('Заказ изменен', { keepAfterRouteChange: true });
        history.push('..');
      })
      .catch(alertService.error);
  }

  function onSubmit(data) {
    if (!isDirty) {
      alertService.warn('Заказ не изменен. Нечего сохранять ;) ', { keepAfterRouteChange: true });
      console.log('onSubmit -> isDirty', isDirty);
      return true;
    }
    console.log('onSubmit -> isDirty', isDirty);
    return isAddMode
      ? createOrder(data)
      : updateOrder(id, data);
  }

  return (
    <Grid container className="content" spacing={1} justify="center">
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <h4>
          {isAddMode ? 'Добавление заказа: ' : 'Редактирование заказа: '}
          {getValues('id') || 'Новый'}
        </h4>
        <p>
          {'создан: '}
          {getValues('date') || 'Сегодня'}
        </p>
        <p>
          {'пользователем: '}
          {getValues('user_name') || 'Нет данных'}
        </p>
        <div className="form-row">
          <div className="form-group col-5">
            <Controller
              name="sample"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CheckBox
                  onChange={onChange}
                  value={value}
                  label="Заказ на образцы"
                  isDisabled={getValues('details') || false}
                />
              )}
            />
          </div>
        </div>
        <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
          {divisions && (
            <Controller
              name="division_code"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={divisions}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  isDisabled={getValues('details') || false}
                  label="Подразделение"
                />
              )}
            />
          )}
          {customers && (
            <Controller
              name="customer_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={customers}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  isDisabled={getValues('details') || false}
                />
              )}
            />
          )}
          {filials && (
            <Controller
              name="comment"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={filials}
                  onChange={onChange}
                  value={value}
                  isDisabled={getValues('details') || false}
                />
              )}
            />
          )}
        </Stack>
        <div className="form-group">
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1" />}
            Save
          </button>
          <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
        </div>
      </form>
      <Divider />
      <Box sx={{
        height: '100%',
        width: '100%',
      }}
      >
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <DataGrid
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            rows={oRows || []}
            columns={columnsForDataGrid}
            rowCount={totalItems || 0}
            gridPageCountSelector
            pageSizeOptions={[10]}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}

            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}

            autoHeight
            loading={loading}

          />
        </Stack>
      </Box>
    </Grid>
  );
}

export { AddEdit };
