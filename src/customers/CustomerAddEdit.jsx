import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Unstable_Grid2';
import { useForm } from 'react-hook-form';
import { ControlledTextField } from '@/_helpers';


const CustomerAddEdit = (props) => {
    let { defaultValues } = props;
    const { control } = useForm({ values: defaultValues, },);
    return (
        <Grid container sx={{ mt: 2 }} flex-wrap>
        <Grid item md={12}>
          <ControlledTextField
            name="name"
            control={control}
            label="Наименование"
            focused={true}
          />
        </Grid>
        <Grid item md={12}>
          <ControlledTextField
            name="email"
            control={control}
            label="E-Mail"
          />
        </Grid>
        <Grid item md={12}>
          <ControlledTextField
            name="phone"
            control={control}
            label="Телефон"
          />
        </Grid>
      </Grid>

    );
  };

export { CustomerAddEdit };

CustomerAddEdit.propTypes = {
    defaultValues: PropTypes.object.isRequired, 
};
/*
  <CustomerAddEdit
            name="name"
            label="Наименование"
            defaultValue="input..."
          />


                <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field }) => (
          <TextField
            inputRef={focused ? ((input) => input?.focus()) : undefined} 
            {...field}
            fullWidth
            variant={variant || "outlined"}
            label={label}
          />
        )}
      />

      */