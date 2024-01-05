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


// const TagSelector = ({ selectedTags, setSelectedTags, availableTags }) => {
//   const { themeName } = useTheme();
//   const customStyles = {
//     control: (provided) => ({
//       ...provided,
//       width: '100%',
//       backgroundColor: themeName === 'dark' ? '#404040' : 'white',
//       borderColor: themeName === 'dark' ? '#ff7f47' : '#ff0072',
//       boxShadow: 'none',
//       '&:hover': {
//         borderColor: themeName === 'dark' ? '#ff7f47' : '#ff0072',
//       },
//     }),
//     multiValue: (provided) => ({
//       ...provided,
//       backgroundColor: themeName === 'dark' ? '#ff7f47' : '#ff0072',
//       borderRadius: '15px',
//       padding: '6px 12px',
//     }),
//     multiValueLabel: (provided) => ({
//       ...provided,
//       fontSize: '14px',
//       color: themeName === 'dark' ? 'white' : 'white',
//     }),
//     multiValueRemove: (provided) => ({
//       ...provided,
//       cursor: 'pointer',
//       ':hover': {
//         backgroundColor: themeName === 'dark' ? '#fd6a2b' : '#ff0072',
//         color: themeName === 'dark' ? 'white' : '#303030',
//       },
//     }),
//     placeholder: (provided) => ({
//       ...provided,
//       color: themeName === 'dark' ? '#ff7f47' : '#ff0072',
//       fontSize: '16px',
//     }),
//     dropdownIndicator: (provided) => ({
//       ...provided,
//       color: themeName === 'dark' ? '#ff7f47' : '#ff0072',

//       '&:hover': {
//         color: themeName === 'dark' ? '#fd6a2b' : '#ff0072',
//       },
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isFocused ? (themeName === 'dark' ? '#ff7f47' : '#ff0072') : (themeName === 'dark' ? '#404040' : 'white'),
//       color: state.isFocused ? 'white' : (themeName === 'dark' ? '#ff7f47' : '#000'),
//       '&:active': {
//         backgroundColor: themeName === 'dark' ? '#ff7f47' : '#ff0072',
//         color: 'white',
//       },
//     }),
//   };
//   return (
//     <CreatableSelect
//       className="my-select"
//       isMulti
//       onChange={setSelectedTags}
//       value={selectedTags}
//       options={availableTags}
//       placeholder="Select or create tags"
//       styles={customStyles}
//     />
//   );
// };

// export default TagSelector;
