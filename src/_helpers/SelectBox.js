import Select from "react-select";
import { useState } from 'react';

const SelectBox = ({ options, defaultValue, name, onChange, isSearchable, isClearable, ref }) => {
    const [optionSelected, setSelectedOptions] = useState([]);
  
    const handleChange = (selected) => {
      onChange({ name, category: selected.value });
      console.log(`SelectBox handleChange ${selected}`)
      setSelectedOptions(selected);
    };
  
    return (
      <Select
        options={options}
        isLoading={!options}
        defaultValue={defaultValue ? defaultValue : options[0]}
        isSearchable = {isSearchable}
        isClearable = {isClearable}
        closeMenuOnSelect={true}
        onChange={handleChange}
        value={optionSelected}
        name={name}
        ref={ref}
      />
    );
  };

  export default SelectBox;