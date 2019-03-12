import React, { Component } from 'react';
import { connect } from 'react-redux';

import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../../uploader-axios';
import * as actionTypes from '../../../store/actions/actionTypes';
import classes from './FileLoader.css';
import ErrorModal from '../../../components/UI/ErrorModal/ErrorModal';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Backdrop from '../../../components/UI/Backdrop/Backdrop';

import LoadButton from './LoadButton/LoadButton';
import ImageList from './ImageList/ImageList';
import VideoList from './VideoList/VideoList';

const MAX_WIDTH = 1000;
const MAX_HEIGHT = 1000;

function resize (file, maxWidth, maxHeight, fn) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
        const dataUrl = event.target.result;
        const image = new Image();
        image.onload = function () {
            const resizedDataUrl = resizeImage(image, maxWidth, maxHeight, 0.9);
            fn(resizedDataUrl);
        };
        image.src = dataUrl;
    };
}

function resizeImage(image, maxWidth, maxHeight, quality) {
    const canvas = document.createElement('canvas');

    let width = image.width;
    let height = image.height;

    if (width > height) {
        if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
        }
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", quality);
}

class FileLoader extends Component {

  constructor(props) {
    super(props);
    this.imgFile = null;
    this.state = {
      message: ''
    }
  }

  saveImage = (resizedDataUrl) => {
    this.props.onItemLoadingStart();
    axios.post('api/save-image.php', JSON.stringify({galleryId: this.props.gallery.id, img: resizedDataUrl}))
           .then((response)=>{
              const newImages = [...this.props.gallery.images, response.data.imgFileName];
              const gallery = {...this.props.gallery, images: newImages}
              this.props.onChangeItemSuccess(gallery);
           }).catch((error)=> {
              this.props.onItemLoadingFail();
           });
  }

  saveVideo = ( file ) => {
    this.props.onItemLoadingStart();
    const formData = new FormData()
    formData.append('galleryId', this.props.gallery.id);
    formData.append('file', file);
    axios.post('api/save-video.php', formData)
           .then((response)=>{
              const newVideo = [...this.props.gallery.video, response.data.videoFileName];
              const gallery = {...this.props.gallery, video: newVideo}
              this.props.onChangeItemSuccess(gallery);
           }).catch((error)=> {
              this.props.onItemLoadingFail();
           });
  }

  handleDeleteImage = (id) => {
    this.props.onItemLoadingStart();
    axios.post('api/delete-image.php', JSON.stringify({galleryId: this.props.gallery.id, imgId: id}))
           .then((response)=>{
              const newImages = this.props.gallery.images.filter(imageId => imageId !== id)
              const gallery = {...this.props.gallery, images: newImages}
              this.props.onChangeItemSuccess(gallery);
           }).catch((error)=> {
              this.props.onItemLoadingFail();
           });
  }

  handleDeleteVideo = (id) => {
    this.props.onItemLoadingStart();
    axios.post('api/delete-video.php', JSON.stringify({galleryId: this.props.gallery.id, video: id}))
           .then((response)=>{
              const newVideo = this.props.gallery.video.filter(videoId => videoId !== id)
              const gallery = {...this.props.gallery, video: newVideo}
              this.props.onChangeItemSuccess(gallery);
           }).catch((error)=> {
              this.props.onItemLoadingFail();
           });
  }

  handleAddFile = (file) => {
    if (file) {
      const extention = file.name.split('.').pop()
      if (extention.toLowerCase() === 'jpeg' || extention.toLowerCase() === 'jpg') {
         resize(file, MAX_WIDTH, MAX_HEIGHT, this.saveImage)
      }
      else {
        if (file.size > 5242880*6) {
          this.setState({ message: 'Видео файл размером более 30МБ!' });
        } else {
          this.saveVideo(file)
        }
      }
    }
  }

  confirmErrorHandler = () => {
    this.setState({message: ''})
  }

  render() {
    return (
      <div className ={ classes.imageLoader } >
        <div className = {classes.loadbutton }>
          <LoadButton onAddFile = { this.handleAddFile } />
        </div>
        { this.props.itemLoading && <div class = {classes.spinnerWrapper} ><Spinner /></div> }
        { this.props.itemLoading && <Backdrop show = { this.props.itemLoading } clicked = { ()=>{} } />}
        <ErrorModal show={this.state.message}
                    message={this.state.message}
                    cancelHandler={this.confirmErrorHandler} />

        <ImageList imgFiles = { this.props.gallery.images }
                   path = { this.props.path + '/' + this.props.gallery.id+'/' }
                   handleDeleteImage = { this.handleDeleteImage } />
        <VideoList videoFiles = { this.props.gallery.video }
                              path = { this.props.path + '/' + this.props.gallery.id+'/' }
                              handleDeleteVideo = { this.handleDeleteVideo } />
      </div>
    )
  };

}

const mapStateToProps = state => {
    return {
        error: state.gallery.error,
        loading: state.gallery.loading,
        itemError: state.gallery.itemError,
        itemLoading: state.gallery.itemLoading,
        gallery: state.gallery.gallery,
        path: state.gallery.path
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onItemLoadingStart: () => dispatch({type: actionTypes.LOADING_ITEM_START}),
        onItemLoadingFail: () => dispatch({type: actionTypes.LOADING_ITEM_FAIL}),
        onChangeItemSuccess: (data) => dispatch({type: actionTypes.CHANGE_ITEM_SUCCESS, data: data})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( FileLoader, axios ));
