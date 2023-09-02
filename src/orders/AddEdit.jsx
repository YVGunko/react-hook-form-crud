import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Select from "react-select";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { orderService, divisionService, alertService } from '@/_services';

const SelectBox = ({ options, defaultValue, name, onChange, isSearchable, isClearable, ref }) => {
    const [optionSelected, setSelectedOptions] = useState([]);
  
    const handleChange = (selected) => {
      onChange({ name, category: selected.value });
      console.log(`SelectBox handleChange ${selected}`)
      setSelectedOptions(selected);
    };
  
    return (
      <Select
        options={options}
        isLoading={!options}
        defaultValue={defaultValue ? defaultValue : options[0]}
        isSearchable = {isSearchable}
        isClearable = {isClearable}
        closeMenuOnSelect={true}
        onChange={handleChange}
        value={optionSelected}
        name={name}
        ref={ref}
      />
    );
  };

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;

    const divisions = divisionService.getAll();
    
    // form validation rules 
    /*
    {"id":"328-17",
    "comment":"Стиль-Пласт+","details":"Рокси ПУ (Зима) р.42,Рокси ПУ (Зима) р.42...",
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
        user_id: Yup.string()
            .required('Пользователь должен быть установлен!'),
    });

    // functions to build form returned by useForm() hook
    const { register, handleSubmit, reset, setValue, errors, formState } = useForm({
        resolver: yupResolver(validationSchema)
    });

    function onSubmit(data) {
        return isAddMode
            ? createOrder(data)
            : updateOrder(id, data);
    }

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

    useEffect(() => {
        if (!isAddMode) {
            // get order and set form fields
            orderService.getById(id).then(order => {
                const fields = ['id', 'customer_id', 'customer_name',
                 'division_code', 'division_name', 
                 'user_id', 'user_name', 
                 'sample', 'date'];
                fields.forEach(field => setValue(field, order[field]));
            });
        }
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            <h1>{isAddMode ? 'Создать заказ' : 'Изменить заказ'}</h1>
            <div className="form-row">
                <div className="form-group  col-5">
                    <label>Номер заказа: </label>
                    <input name="id" type="text" ref={register} className={`form-control ${errors.id ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.id?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group  col-5">
                    <label>Дата заказа: </label>
                    <input name="date" type="text" ref={register} className={`form-control ${errors.date ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.date?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-5">
                    <label>divisions</label>
                    <select name="role" ref={register} className={`form-control ${errors.role ? 'is-invalid' : ''}`}>
                        options={divisions}
                    </select>
                    <div className="invalid-feedback">{errors.role?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-5">
                    <SelectBox
                        options={divisions}
                        defaultValue={!isAddMode ? : ''}
                        name={"selectDiv"}
                        onChange={handleChange}
                        isSearchable={false}
                        isClearable={false}
                        ref={register}
                        />
                </div>
            </div>

            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save
                </button>
                <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}

export { AddEdit };