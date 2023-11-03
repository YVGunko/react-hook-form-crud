import Select, { components } from 'react-select';
import React from 'react';
import {
  Button,
} from '@mui/material';
import PropTypes from 'prop-types';
import {
  InputLabel,
} from '@mui/material';
import { MultiDialog } from '@/_helpers';
import { CustomerAddEdit } from '../customers/CustomerAddEdit';
import { customerService } from '../_services/customer.service';

const msgStyles = {
  background: 'white',
  color: 'black',
};
/*
<MultiDialog title = "Клиенты"
                                  description = "Заполните данные клиента"
                                  content = {<CustomerAddEdit
                                    defaultValues={ customerService.getNew(getValues('customer_name') || '') }
                                            />}
                                            doSave = { customerService.create() }/>}
                            btnCaption="Добавить клента"
                          />
*/
function SelectBoxNoOptionButton({
  rows, onChange, value, isClearable, isDisabled, isMulti, isSearchable, desc, defaultValue, btnCaption,
}) {
  const options = rows || [];
  const defValue = (options && value) ? options.find((c) => c.value === value) : '';
  const NoOptionsMessage = (props) => {
    return (
      <components.NoOptionsMessage {...props}>
        <MultiDialog title = {desc}
            description = {desc}
            content = { <CustomerAddEdit defaultValues={ defaultValue } /> }
            doSave = { customerService.create ()}
          >{btnCaption}</MultiDialog>
      </components.NoOptionsMessage>
    );
  };
  return (
    <>
      <InputLabel shrink htmlFor={defValue} sx={{ mb: -1, mt: 1, mx: 1 }}>
        {desc}
      </InputLabel>
      <Select
        options={options}
        value={defValue}
        onChange={(val) => onChange(val.value)}
        isLoading={!rows}
        isDisabled={isDisabled}
        isMulti={isMulti}
        isSearchable={isSearchable}
        isClearable={isClearable}
        closeMenuOnSelect
        fullWidth
        placeholder="Выбор..."
        components={{ NoOptionsMessage }}
        styles={{ noOptionsMessage: (base) => ({ ...base, ...msgStyles }) }}
      />
    </>

  );
}

export { SelectBoxNoOptionButton };

SelectBoxNoOptionButton.propTypes = {
    rows: PropTypes.shape(PropTypes.arrayOf({
      value: PropTypes.string,
      label: PropTypes.string
    })),
    value: PropTypes.string.isRequired,
    isSearchable: PropTypes.bool.isRequired,
    isClearable: PropTypes.bool.isRequired,
    isMulti: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool.isRequired, 
    onChange: PropTypes.func.isRequired,
    defaultValue: PropTypes.object.isRequired,
    desc: PropTypes.string.isRequired,
    btnCaption: PropTypes.string.isRequired,
};
