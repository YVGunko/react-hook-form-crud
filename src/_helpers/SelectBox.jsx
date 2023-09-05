import Select from 'react-select';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function SelectBox({
  options, defaultValue, name, onChange, isSearchable, isClearable, ref,
}) {
  const [optionSelected, setSelectedOptions] = useState([]);

  const handleChange = (selected) => {
    onChange({ name, category: selected.value });
    console.log(`SelectBox handleChange ${selected}`);
    setSelectedOptions(selected);
  };

  return (
    <Select
      options={options}
      isLoading={!options}
      defaultValue={defaultValue || options[0]}
      isSearchable={isSearchable}
      isClearable={isClearable}
      closeMenuOnSelect
      onChange={handleChange}
      value={optionSelected}
      name={name}
      ref={ref}
    />
  );
}

export default SelectBox;

SelectBox.propTypes = {
  options: PropTypes.element.isRequired,
  defaultValue: PropTypes.element.isRequired,
  name: PropTypes.string.isRequired,
  isSearchable: PropTypes.string.isRequired,
  isClearable: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  ref: PropTypes.element.isRequired,
};
