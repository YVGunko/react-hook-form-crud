import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import {
  Button, Divider, Box,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
  SelectBox, JoyCheckBox, ControlledTextField,
} from '@/_helpers';
import {
  productService, colorService, orderRowService, alertService,
} from '@/_services';

function RowAddEdit({
  divisionCode, curRow, setCurRow, setCurRowSaved,
}) {
  // form init
  const {
    control,
    formState: {
      isSubmitting, isDirty,
    },
    handleSubmit,
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
        setCurRowSaved(true);
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
    if (divisionCode) {
      const raw = await colorService.getAll(divisionCode);
      setColors(raw.map((item) => ({
        value: item.id,
        label: item.name,
      })));
    }
  }, [divisionCode]);
  useEffect(() => {
    if (divisionCode) {
      fetchProducts();
      fetchColors();
    }
  }, [divisionCode]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
      { curRow ? <Grid container>
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
                  placeholder="Подошва"
                />
              )}
            />
          )}
        </Grid>
        <Grid container sx={{ mt: 1, mb: 1 }} >
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
                  placeholder="Цвет"
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
                  placeholder="Подклада"
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
                  placeholder="Рант"
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
                  placeholder="Шпальт"
                />
              )}
            />
          )}
        </Grid>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 3, mt: 2,
        }}
        >
          <Grid item xs={3}>
            <Controller
              name="tert"
              control={control}
              render={({ field: { onChange, value } }) => (
                <JoyCheckBox
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
                <JoyCheckBox
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
                <JoyCheckBox
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
                <JoyCheckBox
                  onChange={onChange}
                  value={value}
                  label="1/2"
                  isDisabled={isSubmitting}
                />
              )}
            />
          </Grid>
        </Box>
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
                  placeholder="Вставка"
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
                  placeholder={divisionCode === '00-000025' ? 'Шпальт' : 'Краска'}
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
                  placeholder="Спойлер"
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
                  placeholder="Губа"
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
                  placeholder="Каблук"
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
                  placeholder="Пятка"
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
                  placeholder="Геленок"
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
                  placeholder="След"
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
                  placeholder="Матировка"
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
                  placeholder="Печать"
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
                  placeholder="Прошив"
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
                  placeholder="Пластизоль"
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
      </Grid> :""}
    </form>
  );
}

export { RowAddEdit };

RowAddEdit.propTypes = {
  divisionCode: PropTypes.string.isRequired,
  curRow: PropTypes.object,
  setCurRow: PropTypes.func.isRequired,
  setCurRowSaved: PropTypes.func.isRequired,
};
