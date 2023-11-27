import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';

function CreatableSelectBox(createOption, rows, onChange, value, placeholder,) {
    const [options, setOptions] = useState(rows || []);

    const formatCreateLabel = (inputValue) => `Создать нового клиента: ${inputValue}`;
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = (inputValue) => {
        setIsLoading(true);

        const newOption = createOption(inputValue);
        setIsLoading(false);
        setOptions((prev) => [...prev, newOption]);
        //setValue(newOption);

    };

    return (
        <>
            <CreatableSelect
                onChange={onChange}
                onCreateOption={handleCreate}
                options={options}
                value={value}
                placeholder={placeholder}
                formatCreateLabel={formatCreateLabel}                
                isClearable
                isDisabled={isLoading}
                isLoading={isLoading}
            />
        </>
    );
}

export { CreatableSelectBox };

CreatableSelectBox.propTypes = {
    createOption: PropTypes.func,
    options: PropTypes.array,
    value: PropTypes.string,
};