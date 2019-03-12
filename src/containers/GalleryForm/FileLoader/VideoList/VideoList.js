import React from 'react';

import UVideo from './UVideo/UVideo';
import classes from './VideoList.css';

const videoList = (props) => {
      const list = props.videoFiles.map((item, index)=>{
      return (<li key={index} className={classes.item}>
          <UVideo
            dataUrl={ props.path + item }
            handleDeleteVideo = { () =>props.handleDeleteVideo(item) }/>
        </li>)
    });
    return (
      <React.Fragment>
        <ul className = { classes.videoList }>
            { list }
        </ul>
      </React.Fragment>)
};

export default videoList;
