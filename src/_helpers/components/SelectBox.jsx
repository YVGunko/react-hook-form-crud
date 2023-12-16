import Select from 'react-select';
import React from 'react';
import PropTypes from 'prop-types';

function SelectBox({
  rows, onChange, value, placeholder, isClearable, isDisabled, isMulti, isSearchable, handleInputChange,
}) {
  const options = rows || [];
  const defValue = (options && value) ? options.find((c) => c.value === value) : '';
  return (
    <>
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
        noOptionsMessage={() => "выбора нет..."}
        placeholder={placeholder || "Выбор"} 
        onInputChange={handleInputChange}
      />
    </>

  );
}

export { SelectBox };

SelectBox.propTypes = {
  rows: PropTypes.shape(PropTypes.arrayOf({
    value: PropTypes.string,
    label: PropTypes.string
  })),
  value: PropTypes.string,
  placeholder: PropTypes.string,
  isSearchable: PropTypes.bool,
  isClearable: PropTypes.bool,
  isMulti: PropTypes.bool,
  isDisabled: PropTypes.bool, 
  onChange: PropTypes.func,
  handleInputChange: PropTypes.func,
};
