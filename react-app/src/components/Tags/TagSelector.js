import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { useTheme } from '../../context/ThemeContext';

import './TagSelector.css';
const TagSelector = ({ selectedTags, setSelectedTags, availableTags }) => {
  const { themeName } = useTheme();
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '100%',
      backgroundColor: themeName === 'dark' ? '#2D2D2D' : '#FAFAFA',
      borderColor: themeName === 'dark' ? '#FF7EB3' : '#FFA69E',
      boxShadow: 'none',
      '&:hover': {
        borderColor: themeName === 'dark' ? '#FF5678' : '#FF7EB3',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: themeName === 'dark' ? '#FF7EB3' : '#FFA69E',
      borderRadius: '15px',
      padding: '6px 12px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      fontSize: '14px',
      color: 'white',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      cursor: 'pointer',
      ':hover': {
        backgroundColor: themeName === 'dark' ? '#FF5678' : '#FF7EB3',
        color: 'white',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: themeName === 'dark' ? '#FF7EB3' : '#FFA69E',
      fontSize: '16px',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: themeName === 'dark' ? '#FF7EB3' : '#FFA69E',

      '&:hover': {
        color: themeName === 'dark' ? '#FF5678' : '#FF7EB3',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? (themeName === 'dark' ? '#FF7EB3' : '#FFA69E') : (themeName === 'dark' ? '#2D2D2D' : '#FAFAFA'),
      color: state.isFocused ? 'white' : (themeName === 'dark' ? '#FF7EB3' : '#000'),
      '&:active': {
        backgroundColor: themeName === 'dark' ? '#FF5678' : '#FF7EB3',
        color: 'white',
      },
    }),
  };
  return (
    <CreatableSelect
      className="my-select"
      isMulti
      onChange={setSelectedTags}
      value={selectedTags}
      options={availableTags}
      placeholder="Select or create tags"
      styles={customStyles}
    />
  );
};

export default TagSelector;
