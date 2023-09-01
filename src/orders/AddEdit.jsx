import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { orderService, alertService } from '@/_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;
    
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
            .required('Номер заказа обязательно'),
        date: Yup.string()
            .required('Номер заказа обязательно'),
        customer_id: Yup.string()
            .required('Клиент обязательно'),
        division_code: Yup.string()
            .required('Подразделение обязательно'),
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
                <div className="form-group col-7">
                    <label>Номер заказа: </label>
                    <input name="id" type="text" ref={register} className={`form-control ${errors.id ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.id?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-7">
                    <label>Дата заказа: </label>
                    <input name="date" type="text" ref={register} className={`form-control ${errors.date ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.date?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-7">
                    <label>Phone</label>
                    <input name="phone" type="text" ref={register} className={`form-control ${errors.phone ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.phone?.message}</div>
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