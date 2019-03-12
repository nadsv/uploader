import React from 'react';

import UImage from './UImage/UImage';

import classes from './ImageList.css';

const imageList = (props) => {
      const list = props.imgFiles.map((item, index)=>{
      return (<li key={index} className={classes.item}>
          <UImage
            dataUrl={ props.path + item }
            handleDeleteImage = { () =>props.handleDeleteImage(item) }/>
        </li>)
    });
    return (
      <React.Fragment>
        <ul className = { classes.imgList }>
            { list }
        </ul>
      </React.Fragment>)
};

export default imageList;
