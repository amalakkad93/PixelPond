import React from 'react';
import CreatableSelect from 'react-select/creatable';

const TagSelector = ({ selectedTags, setSelectedTags, availableTags }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '100%',
      backgroundColor: 'white',
      borderColor: '#5d3b8b',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#b39ddb',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#ffcc00',
      borderRadius: '15px',
      padding: '6px 12px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      fontSize: '14px',
      color: '#303030',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      cursor: 'pointer',
      ':hover': {
        backgroundColor: '#e6b800',
        color: '#303030',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#5d3b8b',
      fontSize: '16px',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#5d3b8b',
      '&:hover': {
        color: '#b39ddb',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#b39ddb' : 'white',
      color: state.isFocused ? 'white' : '#5d3b8b',
      '&:active': {
        backgroundColor: '#5d3b8b',
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
