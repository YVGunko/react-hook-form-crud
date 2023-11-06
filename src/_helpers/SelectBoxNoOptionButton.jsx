import Select, { components } from 'react-select';
import React, { useState } from "react";
import {
  Button,
} from '@mui/material';
import PropTypes from 'prop-types';
import { MultiDialog } from '@/_helpers';
import { CustomerAddEdit } from '../customers/CustomerAddEdit';
import { customerService } from '../_services/customer.service';

const msgStyles = {
  background: 'white',
  color: 'black',
};

function SelectBoxNoOptionButton({
  rows, onChange, value, placeholder, isClearable, isDisabled, isMulti, isSearchable, description, defaultValue, btnCaption,
}) {
  const [open, setOpen] = useState(false);
  const options = rows || [];
  const defValue = (options && value) ? options.find((c) => c.value === value) : '';
  const NoOptionsMessage = (props) => {
    return (
      <components.NoOptionsMessage {...props}>
        <Button
          onClick={() => {
            setOpen(true); // update state on click
          }}
        >
          {btnCaption}
        </Button>
      </components.NoOptionsMessage>
    );
  };
  return (
    <>
      <MultiDialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title={placeholder}
        description={description}
        content={<CustomerAddEdit customer={defaultValue} />}
        doSave={() => console.log("MultiDialog doSave fired")}
      ></MultiDialog>
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
        placeholder={placeholder || "Выбор"} 
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
  placeholder: PropTypes.string.isRequired,
  isSearchable: PropTypes.bool.isRequired,
  isClearable: PropTypes.bool.isRequired,
  isMulti: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  btnCaption: PropTypes.string.isRequired,
};
