import React from 'react';

import classes from './UVideo.css';

const uVideo = (props) => {
        let video
        if (props.dataUrl) {
          video = <div  className={classes.video}>
                        <div className={classes.delete} onClick = { props.handleDeleteVideo } ></div>
                        <video width="320" controls muted preload="none">
                          <source src = { props.dataUrl } type = "video/mp4" />
                        </video>
                  </div>
        }
        return video
    }

export default uVideo;
