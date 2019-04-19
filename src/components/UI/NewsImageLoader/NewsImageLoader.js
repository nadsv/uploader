import React, { Component } from 'react';
import Button from '../Button/Button';

import classes from './NewsImageLoader.css'

const IMAGE_WIDTH = 350

class NewsImageLoader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showImage: props.show
    }

    this.fileInput = React.createRef()
    this.image = React.createRef()
    this.imageWidth = 350;
  }

  deleteHandler = ()=> {
    this.setState({showImage: false})
    this.props.imageChangeHandler('')
  }

  ImageChangedHandler = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader()

      reader.onload = (event) => {
        this.image.current.src = event.target.result
        var img = new Image();

        img.onload = () => {
            if (img.width < IMAGE_WIDTH) {
              this.imageWidth = img.width
              this.image.current.width = this.imageWidth
            } else {
              this.image.current.width = IMAGE_WIDTH
            }
        };

        img.src = reader.result;
      };

      this.setState({showImage: true},
          () => {
            reader.readAsDataURL(selectedFile)
            this.props.imageChangeHandler(selectedFile)
          }
      )
    }
  }


  render() {
      const dt = new Date();
      const param = dt.toISOString();
      const src = (this.image.current) ? this.image.current.src : this.props.link+`?${param}`
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
                    <img src={src} alt="Фото" ref={this.image}/>
             </div>
             : null
           }

        </div>
      );
  }
}



export default NewsImageLoader;
