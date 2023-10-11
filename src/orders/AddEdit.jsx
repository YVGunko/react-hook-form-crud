import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Paper, Button, Divider, Typography, Stack, Box, ButtonGroup, IconButton, Tooltip,
} from '@mui/material';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Grid from '@mui/material/Unstable_Grid2';
import { DataGrid, ruRU } from '@mui/x-data-grid';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import {
  userService, orderService, divisionService, alertService, customerService, filialService,
} from '@/_services';
// eslint-disable-next-line import/extensions
import { SelectBox, CheckBox } from '@/_helpers';
import { OrderRowsBox } from './OrderRowsBox';

const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

const ItemH5 = styled(Paper)(({ theme }) => ({
  ...theme.typography.h5,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 50,
  lineHeight: '50px',
}));
const ItemBody = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 50,
  lineHeight: '50px',
}));

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
  function createOrder(data) {
    return orderService.create(data)
      .then(() => {
        alertService.success('Новый заказ создан', { keepAfterRouteChange: true });
      })
      .catch(alertService.error);
  }

  function updateOrder(id, data) {
    return orderService.update(id, data)
      .then(() => {
        alertService.success('Заказ изменен', { keepAfterRouteChange: true });
      })
      .catch(alertService.error);
  }
  function deleteOrder(event, id) {
    if (window.confirm('Удалить безвозвратно? Уверены?')) {
      orderService.delete(id).then(() => {
        history.push(isAddMode ? '.' : '..');
      });
    }
  }
  async function sendOrderByEmail(event, id) {
    event.stopPropagation();
    await orderService.sendMail(id)
      .then(() => {
        alertService.success('Заказ отправлен.', { keepAfterRouteChange: true });
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
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid container>
          <Grid item md={4} xs={6}>
            <ItemH5 variant="elevation">
              Заказ:
              {' '}
              {getValues('id') || 'Новый'}
            </ItemH5>
          </Grid>
          <Grid item md={3} xs={6}>
            <ItemBody variant="elevation">
              Создан:
              {' '}
              {getValues('date') || 'Сегодня'}
            </ItemBody>
          </Grid>
          <Grid item md={2} xs={6}>
            <ItemBody variant="elevation">{getValues('user_name') || '?'}</ItemBody>
          </Grid>
          <Grid item md={1} xs={1}>
            <Divider orientation="vertical" variant="middle" />
          </Grid>
          <Grid item md={2} xs={2}>
            <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
              <ButtonGroup>
                <IconButton type="submit" variant="outlined" disabled={isSubmitting} color="success">
                  {isSubmitting && <span className="spinner-border spinner-border-sm mr-1" />}
                  <Tooltip id="button-save" title="Сохранить">
                    <SaveAltOutlinedIcon />
                  </Tooltip>
                </IconButton>
                <IconButton onClick={(event) => sendOrderByEmail(event, getValues('id'))} disabled={isSubmitting} color="info">
                  {isSubmitting && <span className="spinner-border spinner-border-sm mr-1" />}
                  <Tooltip id="button-send" title="Отправить по email">
                    <EmailOutlinedIcon />
                  </Tooltip>
                </IconButton>

                <IconButton component={Link} to={isAddMode ? '.' : '..'} variant="outlined">
                  <Tooltip id="button-close" title="Закрыть заказ">
                    <CloseOutlinedIcon />
                  </Tooltip>
                </IconButton>
                <IconButton onClick={(event) => deleteOrder(event, getValues('id'))} disabled={isSubmitting} color="warning">
                  {isSubmitting && <span className="spinner-border spinner-border-sm mr-1" />}
                  <Tooltip id="button-delete" title="Удалить заказ">
                    <DeleteForeverOutlinedIcon />
                  </Tooltip>
                </IconButton>
              </ButtonGroup>
            </form>
          </Grid>
          <Box sx={{ width: '100%' }}>
            <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
              <Grid container spacing={2} sx={{ mb: 1 }}>
                <Grid item md={4} xs={6}>
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
                        desc="Подразделение"
                      />
                    )}
                  />
                  )}
                </Grid>
                <Grid item md={4} xs={6}>
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
                        desc="Клиент"
                      />
                    )}
                  />
                  )}
                </Grid>
                <Grid item md={2} xs={3}>
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
                        desc="Филиал"
                      />
                    )}
                  />
                  )}
                </Grid>
                <Grid item md={2} xs={6}>
                  <Controller
                    name="sample"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CheckBox
                        onChange={onChange}
                        value={value}
                        label="Oбразцы"
                        isDisabled={getValues('details') || false}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>

        <Grid item md={12} xs={6}>
          <Divider light flexItem />
        </Grid>
        <OrderRowsBox orderId={id} divisionCode={getValues('division_code')} />
      </Grid>
    </Box>
  );
}

export { AddEdit };

AddEdit.propTypes = {

};
