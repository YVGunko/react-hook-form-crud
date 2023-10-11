import Select from 'react-select';
import React from 'react';
import PropTypes from 'prop-types';
import {
  InputLabel,
} from '@mui/material';

function SelectBox({
  rows, onChange, value, isClearable, isDisabled, isMulti, isSearchable, desc,
}) {
  const options = rows || [];
  const defValue = (options && value) ? options.find((c) => c.value === value) : '';
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
      />
    </>

  );
}

export { SelectBox };

SelectBox.propTypes = {
  /* value: PropTypes.element.isRequired,
  isSearchable: PropTypes.bool.isRequired,
  isClearable: PropTypes.bool.isRequired,
  isMulti: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired, */
  onChange: PropTypes.func.isRequired,
};
