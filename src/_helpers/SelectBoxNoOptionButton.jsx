import Select, { components } from 'react-select';
import React from 'react';
import {
  Button,
} from '@mui/material';
import PropTypes from 'prop-types';
import {
  InputLabel,
} from '@mui/material';

const msgStyles = {
  background: 'skyblue',
  color: 'black',
};

function SelectBoxNoOptionButton({
  rows, onChange, value, isClearable, isDisabled, isMulti, isSearchable, desc, onBtnClick, btnCaption,
}) {
  const options = rows || [];
  const defValue = (options && value) ? options.find((c) => c.value === value) : '';
  const NoOptionsMessage = (props) => {
    return (
      <components.NoOptionsMessage {...props}>
        <Button onClick={() => onBtnClick()}>{btnCaption}</Button>
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
    onBtnClick: PropTypes.func.isRequired,
    desc: PropTypes.string.isRequired,
    btnCaption: PropTypes.string.isRequired,
};
