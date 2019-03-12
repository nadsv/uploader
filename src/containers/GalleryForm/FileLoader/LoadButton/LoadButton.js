import React, { Component } from 'react';

import Button from '../../../../components/UI/Button/Button';
import classes from './LoadButton.css';

class LoadButton extends Component {
    constructor(props) {
      super(props);
      this.myRef = React.createRef();
    }

    render () {
      return (<div className={classes.loadButton}>
        <input type="file"
            style={{display: 'none'}}
            ref = { item => this.myRef = item }
            onChange = { (e) => this.props.onAddFile(e.target.files[0]) }
            accept=".jpeg, .jpg, .mp4"
        />
        <Button size="small"
                type="button"
                btnType="Info"
                clicked={() => this.myRef.click()}>Добавить фото или видео</Button>
      </div>)
  }
};

export default LoadButton;
