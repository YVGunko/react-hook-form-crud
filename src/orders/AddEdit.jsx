import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import {
  orderService, divisionService, alertService, customerService, filialService,
} from '@/_services';
// eslint-disable-next-line import/extensions
import SelectBox from '@/_helpers';

function AddEdit({ history, match }) {
  const { id } = match.params;
  const isAddMode = !id;

  const [filials, setFilials] = useState([]);
  const fetchFil = useCallback(async () => {
    const rawFilials = await filialService.getAll();
    setFilials(rawFilials.map((item) => ({
      value: item.filial_name,
      label: item.filial_name,
    })));
    console.log('fetchFil ');
  }, []);
  useEffect(() => {
    fetchFil();
  }, []);

  const [divisions, setDivisions] = useState([]);
  const fetchDiv = useCallback(async () => {
    const rawDivisions = await divisionService.getAll();
    setDivisions(rawDivisions.map((item) => ({
      value: item.division_code,
      label: item.division_name,
    })));
    console.log('fetchDiv ');
  }, []);
  useEffect(() => {
    fetchDiv();
  }, []);

  const [customers, setCustomers] = useState([]);
  const fetchCus = useCallback(async () => {
    const rawCustomers = await customerService.getAll();
    setCustomers(rawCustomers.customers.map((item) => ({
      value: item.id,
      label: item.name,
    })));
    console.log('fetchCus ');
  }, []);
  useEffect(() => {
    fetchCus();
  }, []);
  // form validation rules
  /*
    {"id":"328-17",
    "comment":"Стиль-Пласт+",
    "details":"Рокси ПУ (Зима) р.42,Рокси ПУ (Зима) р.42...",
    "customer_id":"328",
    "customer_name":"Саркисян Г.-Филиал",
    "division_code":"00-000002",
    "division_name":"ПУ подразделение",
    "user_id":"54",
    "user_name":"абв",
    "sample":true,
    "date":"12.07.2023 15:54:35"}
    */
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
  async function fetchOrder(orderId) {
    const x = await orderService.getById(orderId);
    console.log(`fetchOrder ${JSON.stringify(x)}`);
    return x;
  }
  const {
    setValue,
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

  /* {    defaultValues: async () => { fetch('/api-endpoint')}; }
  const handleChangeType = (option) => {
    setItemType(option);
    const options = getOptions(option.value);
    setList(options);
    setGender(null);
  }; */

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
    return isAddMode
      ? createOrder(data)
      : updateOrder(id, data);
  }

  console.log('errors', errors);
  console.log('isSubmitting', isSubmitting);
  console.log('isDirty', isDirty);
  console.log('defaultValue id', getValues('id'));
  console.log('getValues division_name', getValues('division_name'));
  console.log('dirtyFields', dirtyFields);

  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
      <h1>{isAddMode ? 'Создать заказ' : 'Изменить заказ'}</h1>
      <div className="form-row">
        <div className="form-group  col-5">
          <label>Номер заказа: </label>
          <input {...register('id', { required: true })} type="text" className={`form-control ${errors.id ? 'is-invalid' : ''}`} />
          <div className="invalid-feedback">{errors.id?.message}</div>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group  col-5">
          <label>Дата заказа: </label>
          <input {...register('date', { required: true })} type="text" className={`form-control ${errors.date ? 'is-invalid' : ''}`} />
          <div className="invalid-feedback">{errors.date?.message}</div>
        </div>
      </div>

      {divisions && (
      <div className="form-row">
        <div className="form-group col-5">
        <label>Подразделениe: </label>
          <Controller
            name="division_code"
            control={control}
            render={({ field }) => (
              <Select
                value={divisions.find((c) => c.value === field.value)}
                aria-label="Подразделения"
                options={divisions}
                onChange={handleChange}
              />
            )}
          />
        </div>
      </div>
      )}
      {customers && (
      <div className="form-row">
        <div className="form-group col-5">
          <Controller
            name="customer_id"
            control={control}
            render={({ field }) => (
              <Select
                value={customers.find((c) => c.value === field.value)}
                aria-label="Подразделения"
                options={customers}
                onChange={handleChange}
                isSearchable
              />
            )}
          />
        </div>
      </div>
      )}
      {filials && (
      <div className="form-row">
        <div className="form-group col-5">
          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <Select
                value={filials.find((c) => c.value === field.value)}
                aria-label="Подразделения"
                options={filials}
                onChange={handleChange}
              />
            )}
          />
        </div>
      </div>
      )}
      <div className="form-group">
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting && <span className="spinner-border spinner-border-sm mr-1" />}
          Save
        </button>
        <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
      </div>
    </form>
  );
}

export { AddEdit };

/**
 *            defaultValue={divisions.find((c) => c.value === getValues('division_name'))}
 *       <div className="form-row">
        <div className="form-group col-5">
          <label>divisions</label>
          <select name="role" ref={register} className={`form-control ${errors.role ? 'is-invalid' : ''}`}>
            options=
            {divisions}
          </select>
          <div className="invalid-feedback">{errors.role?.message}</div>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-5">
          <SelectBox
            options={divisions}
            defaultValue={!isAddMode ? fields : ''}
            name="selectDiv"
            onChange={handleChange}
            isSearchable={false}
            isClearable={false}
            ref={register}
          />
        </div>
      </div>
 */
