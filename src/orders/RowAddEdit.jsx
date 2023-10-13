import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import {
  Paper, Button, Divider, Typography, Stack, Box,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
  SelectBox, CheckBox, ControlledTextField, ControlledSelect,
} from '@/_helpers';
import {
  productService, colorService, orderRowService, alertService,
} from '@/_services';

function RowAddEdit({
  divisionCode, curRow, setCurRow, setCurRowChanged,
}) {
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
  function createRow(e) {
    console.log('orderRowService.create e=', e);
    return orderRowService.create(e)
      .then((data) => {
        console.log('orderRowService.create data=', data);
        setCurRow(data);
        setCurRowChanged(true);
      })
      .catch(alertService.error);
  }
  function onSubmit(data) {
    if (!isDirty) {
      alertService.warn('Заказ не изменен. Нечего сохранять ;) ', { keepAfterRouteChange: true });
      return true;
    }
    return createRow(data);
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
    <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
      <Grid container>
        <Grid item md={12} xs={6}>
          <Button type="submit" disabled={isSubmitting || !isDirty} color="primary">
            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1" />}
            Сохранить
          </Button>
          <Button type="reset" disabled={isSubmitting || !isDirty} color="warning">
            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1" />}
            Отменить
          </Button>
        </Grid>
        <Divider />
        <Grid item md={12} xs={12} lg={12}>
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
        <Grid container sx={{ mt: 2 }} flex-wrap>
          <Grid item md={5} xs={5} lg={5}>
            <ControlledTextField
              name="size"
              control={control}
              label="Разм"
            />
          </Grid>
          <Grid item md={2} xs={2} lg={2} />
          <Grid item md={5} xs={5} lg={5}>
            <ControlledTextField
              name="number"
              control={control}
              label="Кол-во"
            />
          </Grid>
        </Grid>
        <Grid item md={6} xs={6} lg={6}>
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
        <Grid item md={6} xs={6}>
          {colors && (
            <Controller
              name="liner_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="Подклада"
                />
              )}
            />
          )}
        </Grid>
        <Grid item md={6} xs={6}>
          {colors && (
            <Controller
              name="rant_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="Рант"
                />
              )}
            />
          )}
        </Grid>
        <Grid item md={6} xs={6}>
          {colors && (
            <Controller
              name="shpalt_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="Шпальт"
                />
              )}
            />
          )}
        </Grid>
        <Grid container sx={{ mt: 2 }} flex-wrap>
          <Grid item xs={3}>
            <Controller
              name="tert"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CheckBox
                  onChange={onChange}
                  value={value}
                  label="Терт."
                  isDisabled={isSubmitting}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="prodir"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CheckBox
                  onChange={onChange}
                  value={value}
                  label="Продир."
                  isDisabled={isSubmitting}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="frez"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CheckBox
                  onChange={onChange}
                  value={value}
                  label="Фрез."
                  isDisabled={isSubmitting}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name="difersize"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CheckBox
                  onChange={onChange}
                  value={value}
                  label="П-пара"
                  isDisabled={isSubmitting}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid item md={6} xs={6}>
          {colors && (
            <Controller
              name="vstavka_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="Вставка"
                />
              )}
            />
          )}
        </Grid>
        <Grid item md={6} xs={6}>
          {colors && (
            <Controller
              name="ashpalt_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc={divisionCode === '00-000025' ? 'Шпальт' : 'Краска'}
                />
              )}
            />
          )}
        </Grid>
        <Grid item md={6} xs={6}>
          {colors && (
            <Controller
              name="spoyler_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="Спойлер"
                />
              )}
            />
          )}
        </Grid>
        <Grid item md={6} xs={6}>
          {colors && (
            <Controller
              name="guba_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="Губа"
                />
              )}
            />
          )}
        </Grid>
        <Grid item md={6} xs={6}>
          {colors && (
            <Controller
              name="kabluk_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="Каблук"
                />
              )}
            />
          )}
        </Grid>
        <Grid item md={6} xs={6}>
          {colors && (
            <Controller
              name="pyatka_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="Пятка"
                />
              )}
            />
          )}
        </Grid>
        <Grid item md={6} xs={6}>
          {colors && (
            <Controller
              name="gelenok_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="Геленок"
                />
              )}
            />
          )}
        </Grid>
        <Grid item md={6} xs={6}>
          {colors && (
            <Controller
              name="sled_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="След"
                />
              )}
            />
          )}
        </Grid>
        <Grid item md={6} xs={6}>
          {colors && (
            <Controller
              name="matirovka_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="Матировка"
                />
              )}
            />
          )}
        </Grid>
        <Grid item md={6} xs={6}>
          {colors && (
            <Controller
              name="pechat_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="Печать"
                />
              )}
            />
          )}
        </Grid>
        <Grid item md={6} xs={6}>
          {colors && (
            <Controller
              name="proshiv_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="Прошив"
                />
              )}
            />
          )}
        </Grid>
        <Grid item md={6} xs={6}>
          {colors && (
            <Controller
              name="plastizol_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectBox
                  rows={colors}
                  onChange={onChange}
                  value={value}
                  isSearchable
                  desc="Пластизоль"
                />
              )}
            />
          )}
        </Grid>
        <Grid item md={12} xs={12} sx={{ mt: 2 }}>
          <ControlledTextField
            name="attribute"
            control={control}
            label="Доп.инфо"
          />
        </Grid>
      </Grid>
    </form>
  );
}

export { RowAddEdit };

RowAddEdit.propTypes = {
  divisionCode: PropTypes.string.isRequired,
  curRow: PropTypes.array.isRequired,
  setCurRowChanged: PropTypes.func.isRequired,
};

/*
        <Grid item md={4} xs={6}>
        <ControlledSelect
          options={colors}
          name="color_id"
          control={control}
          label="Цвет"
        />
      </Grid>
*/
