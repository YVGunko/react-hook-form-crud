import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Paper, Divider, Box, ButtonGroup, IconButton, Tooltip,
} from '@mui/material';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import Grid from '@mui/material/Unstable_Grid2';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { useForm, Controller, useFormContext } from 'react-hook-form';

import {
  orderService, divisionService, alertService, customerService, filialService,
} from '@/_services';
// eslint-disable-next-line import/extensions
import { SelectBox, JoyCheckBox, SelectBoxNoOptionButton } from '@/_helpers';
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
/*
function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }      return ps;
    }, {});    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }    prev.current = props;
  });
}

 Usage
function MyComponent(props) {
  useTraceUpdate(props);
  return <div>{props.children}</div>;
}*/
function AddEdit({ history, match }) {
  const { id } = match.params;
  console.log('AddEdit id', id);
  const { state } = useLocation();
  const { copy } = state || '';
  const isAddMode = !id;
  const isCopyMode = (copy === 'copy');
  const [orderId, setOrderId] = useState(''); // the purpose is to provide newly saved id to child comps 

  const [filials, setFilials] = useState([]);
  const fetchFilials = useCallback(async () => {
    const rawFilials = await filialService.getAll();
    setFilials(rawFilials.map((item) => ({
      value: item.filial_name,
      label: item.filial_name,
    })));
  }, []);

  const [divisions, setDivisions] = useState([]);
  const fetchDivisions = useCallback(async () => {
    const rawDivisions = await divisionService.getAll();
    setDivisions(rawDivisions.map((item) => ({
      value: item.division_code,
      label: item.division_name,
    })));
  }, []);

  const [customers, setCustomers] = useState([]);
  const fetchCustomers = useCallback(async () => {
    const rawCustomers = await customerService.getAll();
    setCustomers(rawCustomers.map((item) => ({
      value: item.id,
      label: item.name,
    })));
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchDivisions();
    fetchFilials();
  }, []);

  // data fetch
  async function fetchOrder(oId) {
    let x = {};
    if (isAddMode) {
      x = orderService.getNew();
    } else {
      x = await orderService.getById(oId);
      console.log(`fetchOrder ${JSON.stringify(x)}`);
    }
    return x;
  }
  // data fetch end
  // form init
  const {
    control,
    formState: {
      isSubmitting, isDirty,
    },
    handleSubmit,
    getValues,
    setValue,
    reset,
  } = useForm(
    { defaultValues: async () => fetchOrder(id) },
  );

  function createOrder(data) {
    return orderService.create(data)
      .then((response) => {
        const fields = ['id', 'comment', 'customer_id', 'customer_name', 'division_code', 'division_name', 'sample', 'date'];
        fields.forEach((field) => setValue(field, response[field]));
        setOrderId(response.id);
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
      return true;
    }
    return isAddMode
      ? createOrder(data)
      : updateOrder(id, data);
  }
  function addCustomer(event) {
    event.stopPropagation();
    alertService.success('here Customer Modal should be opened. Than, if and only new customer was created, customers should be refetched and customer select value should be set to that new customer label', { keepAfterRouteChange: true });
    // TODO 
  }
  const CustomerAddEdit = (props) => {
    const { control } = useForm();
    const { name, label, defaultValue, focused, variant } = props;
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field }) => (
          <TextField
            inputRef={(input) => input?.focus()}
            {...field}
            fullWidth
            variant={variant || "outlined"}
            label={label}
          />
        )}
      />
    );
  };
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
                <Grid container sx={{ mt: 2 }} flex-wrap>
                  <Grid item md={11} xs={11}>
                    {customers && (
                      <Controller
                        name="customer_id"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <SelectBoxNoOptionButton
                            rows={customers}
                            onChange={onChange}
                            value={value}
                            isSearchable
                            isDisabled={!(isAddMode || isCopyMode)}
                            desc="Клиент"
                          />
                        )}
                      />
                    )}
                  </Grid>
                  <Grid item md={1} xs={1} justifyContent="flex-end">
                    <IconButton onClick={(event) => addCustomer(event)} disabled={isSubmitting}>
                      <Tooltip id="button-add" title="Создать заказ">
                        <AddCardOutlinedIcon />
                      </Tooltip>
                    </IconButton>
                  </Grid>
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
                          isDisabled={!(isAddMode || isCopyMode)}
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
                      <JoyCheckBox
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
        {id && getValues('division_code') && (<OrderRowsBox orderId={id || orderId} divisionCode={getValues('division_code')} />)}
      </Grid>
    </Box>
  );
}

export { AddEdit };

AddEdit.propTypes = {

};
