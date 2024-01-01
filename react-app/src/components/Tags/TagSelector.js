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
      backgroundColor: themeName === 'dark' ? '#404040' : 'white',
      borderColor: themeName === 'dark' ? '#ff7f47' : '#ff0072',
      boxShadow: 'none',
      '&:hover': {
        borderColor: themeName === 'dark' ? '#ff7f47' : '#ff0072',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: themeName === 'dark' ? '#ff7f47' : '#ff0072',
      borderRadius: '15px',
      padding: '6px 12px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      fontSize: '14px',
      color: themeName === 'dark' ? 'white' : 'white',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      cursor: 'pointer',
      ':hover': {
        backgroundColor: themeName === 'dark' ? '#fd6a2b' : '#ff0072',
        color: themeName === 'dark' ? 'white' : '#303030',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: themeName === 'dark' ? '#ff7f47' : '#ff0072',
      fontSize: '16px',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: themeName === 'dark' ? '#ff7f47' : '#ff0072',

      '&:hover': {
        color: themeName === 'dark' ? '#fd6a2b' : '#ff0072',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? (themeName === 'dark' ? '#ff7f47' : '#ff0072') : (themeName === 'dark' ? '#404040' : 'white'),
      color: state.isFocused ? 'white' : (themeName === 'dark' ? '#ff7f47' : '#000'),
      '&:active': {
        backgroundColor: themeName === 'dark' ? '#ff7f47' : '#ff0072',
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


// import React from 'react';
// import CreatableSelect from 'react-select/creatable';

// const TagSelector = ({ selectedTags, setSelectedTags, availableTags }) => {
//   const customStyles = {
//     multiValue: (provided) => ({
//       ...provided,
//       backgroundColor: '#ffcc00',
//       color: '#303030',
//       borderRadius: '15px',
//       padding: '6px 12px',
//     }),
//     multiValueLabel: (provided) => ({
//       ...provided,
//       fontSize: '14px',
//     }),
//     multiValueRemove: (provided) => ({
//       ...provided,
//       cursor: 'pointer',
//       ':hover': {
//         backgroundColor: '#e6b800',
//         color: '#303030',
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
