import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import {
  Grid, Paper, Button, Divider, Typography, Stack, Box,
} from '@mui/material';
import { SelectBox, CheckBox } from '@/_helpers';

const [products, setProducts] = useState([]);
const fetchProducts = useCallback(async () => {
  const rawUsers = await productService.getAll();
  setProducts(rawUsers.map((item) => ({
    value: item.id,
    label: item.name,
  })));
  console.log('setProducts ');
}, []);

const [colors, setColors] = useState([]);
const fetchColors = useCallback(async () => {
  const rawUsers = await colorService.getAll();
  setColors(rawUsers.map((item) => ({
    value: item.id,
    label: item.name,
  })));
  console.log('setColors ');
}, []);

function RowAddEdit(props) {
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
    { defaultValues: props.curRow },
  );
  const buttons = [
    {
      title: 'Сохранить',
      action: () => { props.setCurRowChanged(true); },
    },
    {
      title: 'Отменить',
      action: () => { alert('have to set initial value!'); },
    },
  ];
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
              rows={products}
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
