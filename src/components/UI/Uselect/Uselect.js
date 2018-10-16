import React from 'react';

import Select from 'react-select';
import './Uselect.css';

const customStyles = {
  option: (base, state) => ({
    ...base,
    fontSize: '0.8em',
    padding: 10
  }),
  control: (base, state) =>  ({
    ...base,
    width: '100%',
    fontSize: '0.8em',
    borderRadius: 0,
    border: state.isFocused ? '1px solid #ccc !important' : '1px solid #ccc !important',
    borderColor: state.isFocused ? '#ccc' : '#ccc',
    background: state.isFocused ? 'white' : 'white',
    boxShadow: state.isFocused ? 'none' : 'none',
    color: 'black',
  }),

  placeholder: (base, state) => ( {
      display: 'none'
  }),

  menu: (base, state) => ({
    ...base,
    borderRadius: 0,
  }),

  menuList: (base, state) => ({
    ...base,
    borderRadius: 0
  })

}

const Uselect = (props) => {
    return (
        <Select
          options={props.options}
          styles = {customStyles}
          multi={false}
          onChange={(value) => props.onChange(props.name, value)}
          onBlur={() => props.onBlur(props.name, true)}
          value={props.value}
        />
    );
}

export default Uselect;
