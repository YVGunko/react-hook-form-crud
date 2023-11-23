import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';

function CreatableSelectBox(createOption, rows, updateOptions, onChange, value, setValue, placeholder, ) {
    const [options, setOptions] = useState(rows || []);

    const formatCreateLabel = (inputValue) => `Создать нового клиента: ${inputValue}`;
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = (inputValue) => {
        setIsLoading(true);

        const newOption = createOption(inputValue);
        setIsLoading(false);
        setOptions((prev) => [...prev, newOption]);
        setValue(newOption);

    };

    return (
        <>
            <CreatableSelect
                isClearable
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={(newValue) => { setValue(newValue), onChange(newValue.value)}}
                onCreateOption={handleCreate}
                options={options}
                value={value}
                formatCreateLabel={formatCreateLabel}
                placeholder={placeholder}
            />
        </>
    );
}

export { CreatableSelectBox };

CreatableSelectBox.propTypes = {
    createOption: PropTypes.func,
    options: PropTypes.array,
    updateOptions: PropTypes.func,
};