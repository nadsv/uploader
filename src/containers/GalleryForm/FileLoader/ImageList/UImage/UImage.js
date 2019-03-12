import React from 'react';

import classes from './UImage.css';

const uImage = (props) => {
  let image;

  let dataUrl = props.dataUrl;
  if (dataUrl) {
      image = <a href={dataUrl+'.jpeg'} download="photo.jpeg" target="_blank"><img src={dataUrl+'_s.jpeg'} alt="фото"/></a>
  }
  return (<div  className={classes.iconImage}>
                <div className={classes.delete} onClick = { props.handleDeleteImage } ></div>
                { image }
               </div>
    )
};

export default uImage;
