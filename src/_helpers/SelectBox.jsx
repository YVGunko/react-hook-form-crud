import Select from 'react-select';
import React from 'react';
import PropTypes from 'prop-types';

function SelectBox({
  rows, onChange, value, isClearable, isDisabled, isMulti, isSearchable,
}) {
  return (
    <Select
      options={rows || []}
      value={(rows && value) ? { rows }.find((c) => c.value === value) : ''} //TODO Uncaught (in promise) TypeError: {(intermediate value)}.find is not a function
      onChange={(val) => onChange(val.value)}
      isLoading={!rows}
      isDisabled={isDisabled}
      isMulti={isMulti}
      isSearchable={isSearchable}
      isClearable={isClearable}
      closeMenuOnSelect
    />
  );
}

export { SelectBox };

SelectBox.propTypes = {
  /*value: PropTypes.element.isRequired,
  isSearchable: PropTypes.bool.isRequired,
  isClearable: PropTypes.bool.isRequired,
  isMulti: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,*/
  onChange: PropTypes.func.isRequired,
};
