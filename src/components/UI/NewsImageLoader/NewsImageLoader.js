import React, { Component } from 'react';
import Button from '../Button/Button';

import classes from './NewsImageLoader.css'

class NewsImageLoader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showImage: props.show
    }

    this.fileInput = React.createRef()
    this.image = React.createRef()
  }

  deleteHandler = ()=> {
    this.setState({showImage: false})
    this.props.imageChangeHandler('')
  }

  ImageChangedHandler = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        this.image.current.src = event.target.result
      };

      this.setState({showImage: true},
          () => {
            reader.readAsDataURL(selectedFile);
            this.props.imageChangeHandler(selectedFile)
          }
      )
    }
  }


  render() {
      const dt = new Date();
      const param = dt.toISOString();
      return (
        <div className={classes.newsImageLoaderWrapper}>
            <input type="file"
               style={{display: 'none'}}
               onChange={this.ImageChangedHandler}
               ref={fileInput => this.fileInput = fileInput}
               accept=".jpg, .jpeg"
               />
            {
              (!this.state.showImage) ?
              <Button
                   type="button"
                   clicked={()=>this.fileInput.click()}
                   size="small"
                   btnType="Info">
                   Добавить изображение
             </Button>
             :
             null
           }
           {(this.state.showImage) ?
             <div  className={classes.iconImage}>
                    <div className={classes.delete} onClick = { this.deleteHandler } ></div>
                    <img src={this.props.link+`?${param}`} alt="Фото" ref={this.image} width="350"/>
             </div>
             : null
           }

        </div>
      );
  }
}



export default NewsImageLoader;
