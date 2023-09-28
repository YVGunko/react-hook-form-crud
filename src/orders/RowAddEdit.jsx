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
    { defaultValues: curRow },
  );
  const buttons = [
    {
      title: 'Сохранить',
      action: () => { setCurRowChanged(true); },
    },
    {
      title: 'Отменить',
      action: () => { alert('have to set initial value!'); },
    },
  ];
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
    <Grid item md={4} xs={6}>
      <Grid item md={4} xs={6}>
        {products && (
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectBox
                rows={products}
                onChange={onChange}
                value={value}
                isSearchable
                label="Подошва"
              />
            )}
          />
        )}
      </Grid>
      <Grid item md={4} xs={6}>
        {colors && (
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectBox
                rows={colors}
                onChange={onChange}
                value={value}
                isSearchable
                label="Цвет"
              />
            )}
          />
        )}
      </Grid>
    </Grid>
  );
}

export { RowAddEdit };

RowAddEdit.propTypes = {
  divisionCode: PropTypes.string.isRequired,
  curRow: PropTypes.array.isRequired,
  setCurRowChanged: PropTypes.func.isRequired,
};
