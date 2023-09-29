import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import {
  Grid, Paper, Button, Divider, Typography, Stack, Box,
} from '@mui/material';
import { SelectBox, CheckBox } from '@/_helpers';
import {
  productService, colorService, orderRowService, alertService,
} from '@/_services';

function RowAddEdit({ divisionCode, curRow, setCurRowChanged }) {
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
    { values: curRow },
    { defaultValues: curRow },
  );
  function onSubmit(data) {
    if (!isDirty) {
      alertService.warn('Заказ не изменен. Нечего сохранять ;) ', { keepAfterRouteChange: true });
      return true;
    }
    setCurRowChanged(true);
    return isAddMode
      ? createOrder(data)
      : updateOrder(id, data);
  }
  console.log('RowAddEdit curRow', curRow);

  const [products, setProducts] = useState([]);
  const fetchProducts = useCallback(async () => {
    console.log('RowAddEdit fetchProducts divisionCode=', divisionCode);
    if (divisionCode) {
      const raw = await productService.getAll(divisionCode);
      setProducts(raw.map((item) => ({
        value: item.id,
        label: item.name,
      })));
    }
  }, [divisionCode]);

  const [colors, setColors] = useState([]);
  const fetchColors = useCallback(async () => {
    console.log('RowAddEdit fetchColors divisionCode=', divisionCode);
    if (divisionCode) {
      const raw = await colorService.getAll(divisionCode);
      setColors(raw.map((item) => ({
        value: item.id,
        label: item.name,
      })));
    }
  }, [divisionCode]);
  useEffect(() => {
    console.log('RowAddEdit useEffect divisionCode=', divisionCode);
    if (divisionCode) {
      fetchProducts();
      fetchColors();
    }
  }, [divisionCode]);
  return (
    <Grid item md={4} xs={12}>
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <Grid item md={12} xs={6}>
          <Button type="submit" disabled={isSubmitting || !isDirty} className="btn btn-primary">
            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1" />}
            Сохранить
          </Button>
          <Button type="reset" disabled={isSubmitting || !isDirty} className="button btn-danger">
            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1" />}
            Отменить
          </Button>
        </Grid>
        <Divider />
        <Grid item md={12} xs={6}>
          {products && (
            <Controller
              name="product_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={products}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="Подошва"
                />
              )}
            />
          )}
        </Grid>
        <Grid item md={12} xs={6}>
          {colors && (
            <Controller
              name="color_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="Цвет"
                />
              )}
            />
          )}
        </Grid>
      </form>
    </Grid>
  );
}

export { RowAddEdit };

RowAddEdit.propTypes = {
  divisionCode: PropTypes.string.isRequired,
  curRow: PropTypes.array.isRequired,
  setCurRowChanged: PropTypes.func.isRequired,
};
