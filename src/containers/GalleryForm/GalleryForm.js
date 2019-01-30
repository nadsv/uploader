import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withFormik, Form } from 'formik';
import * as Yup from 'yup';

import Spinner from '../../components/UI/Spinner/Spinner';
import Button from '../../components/UI/Button/Button';
import DelModal from '../../components/UI/DelModal/DelModal';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../uploader-axios';
import classes from '../../shared/forms.css';
import * as actionTypes from '../../store/actions/actionTypes';
import './GalleryForm.css';

const formikEnhancer = withFormik({
  mapPropsToValues(props) {
      return {
        docName: props.docName || '',
        date: props.date || '',
        user: props.user || ''
      }
    },

  validationSchema: Yup.object().shape({
    docName: Yup.string().min(5, 'Заголовок должен содержать не менее 5 символов.').required('Заголовок не заполнен.'),
    user: Yup.string().min(5, 'ФИО должны содержать более 5 символов.').required('ФИО не заполнены.'),
    date: Yup.date().required('Дата не заполнена.')
  })
});

class GalleryForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
         deleting: false,
         files: []
     }
     this.filesWithLinks = []
  }

  componentDidMount() {
      if (this.props.gallery) {
        this.props.setFieldValue('docName', this.props.gallery.docName)
        this.props.setFieldValue('user', this.props.gallery.user)
        const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        const dt = new Date(this.props.gallery.date.replace(pattern,'$3-$2-$1'));
        this.props.setFieldValue('date', dt.toISOString().substring(0,10))
    }
  }

  componentWillUnmount() {
    this.props.onInitGallery(null);
  }

  deleteHandler = ( event ) => {
        event.preventDefault();
        this.setState({deleting: true})
  }

  cancelDeleteHandler = () => {
    this.setState({deleting: false})
  }

  confirmDeleteHandler = () => {
    this.setState({deleting: false})
    const data = JSON.stringify({id: this.props.gallery.id});
    axios.post('api/delete-gallery.php', data)
         .then((response)=>{
            if (response) {
              this.props.onGalleryDeleteSuccess();
              this.props.onSearchingRemoveItem(response.data.id.$id);
              for (const key in this.props.values) {
                this.props.setFieldValue(key, '')
                this.props.setFieldTouched(key, false);
              }
            } else {
              this.props.onOperationFail()
            };
         }).catch((error)=> {
            this.props.onOperationFail();
         });
  }



  submitHandler = ( event ) => {
    event.preventDefault();
    const formData = new FormData()
    let galleryData = { ...this.props.values }
    galleryData.id = (this.props.gallery) ? this.props.gallery.id : ''
    formData.append('gallery', JSON.stringify(galleryData));
    this.props.onOperationStart();
    axios.post('api/save-gallery.php', formData)
         .then((response)=>{
            const docData = {...this.props.values,
                                id: response.data.id.$id || this.props.gallery.id
                            }
            this.props.onGallerySaveSuccess(docData);
            const newData = { ...docData };
            newData.category = {label: 'Галерея', value: 'gallery'}
            newData.subCategory = {label: 'Галерея', value: 'gallery'}
            newData.date = this.props.gallery.date.replace(/(\d{4})-(\d{2})-(\d{2})/,'$3.$2.$1')
            this.props.onSearchingUpdateItem( newData )
         }).catch((error)=> {
            this.props.onOperationFail();
         });
  }

  render() {
    const {
      values,
      touched,
      errors,
      dirty,
      isValid,
      isSubmitting,
      handleChange,
      handleBlur,
      setFieldValue,
      setFieldTouched
    } = this.props;

    let form =   <Form onSubmit={this.submitHandler}>
        <div className={classes.formGroup}>
          <label className={classes.label}>Дата</label>
          <input
            type="date"
            name="date"
            className={classes.field}
            value={values.date}
            onChange={handleChange}
            onBlur={handleBlur}
            />
            { touched.date && errors.date && <p className={classes.invalid}>{errors.date}</p> }
        </div>
        <div className={classes.formGroup}>
          <label className={classes.label}>Заголовок</label>
          <textarea name="docName"
            className={classes.field}
            value={values.docName}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="3"/>
            { touched.docName && errors.docName && <p className={classes.invalid}>{errors.docName}</p> }
        </div>
        <div className={classes.formGroup}>
          <label className={classes.label}>ФИО добавившего фотогалерею</label>
          <input
            type="text"
            name="user"
            className={classes.field}
            value={values.user}
            onChange={handleChange}
            onBlur={handleBlur}
            />
            { touched.user && errors.user && <p className={classes.invalid}>{errors.user}</p> }
        </div>
        <Button btnType="Success"
                type="submit"
                disabled={!dirty || isSubmitting || !isValid}>
          Сохранить
        </Button>
        {this.props.gallery && <Button btnType="Success" type="button" clicked={this.deleteHandler}>
                            Удалить
                           </Button>}
    </Form>
    if ( this.props.loading ) {
        form = <Spinner />
    }
    return <div className={classes.wrapper}>
            <DelModal show={this.state.deleting}
              cancelHandler={this.cancelDeleteHandler}
              confirmHandler={this.confirmDeleteHandler}>
            </DelModal>
            <h1>Фотогалерея</h1>
            {form}
     </div>
 ;
}
}

const mapStateToProps = state => {
    return {
        error: state.gallery.error,
        loading: state.gallery.loading,
        gallery: state.gallery.gallery,
        path: state.gallery.path
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onOperationStart: () => dispatch({type: actionTypes.OPERATION_START}),
        onOperationFail: () => dispatch({type: actionTypes.OPERATION_FAIL}),
        onGallerySaveSuccess: (data) => dispatch({type: actionTypes.SAVE_GALLERY_SUCCESS, data: data}),
        onInitGallery: (data) => dispatch({type: actionTypes.INIT_GALLERY, data: data}),
        onSearchingUpdateItem: (docData) => dispatch({type: actionTypes.SEARCHING_UPDATE_ITEM, docData: docData}),
        onGalleryDeleteSuccess: () => dispatch({type: actionTypes.DELETE_GALLERY}),
        onPhotoDeleteSuccess: (data) => dispatch({type: actionTypes.DELETE_GALLERY_PHOTO, data: data}),
        onSearchingRemoveItem: (id) => dispatch({type: actionTypes.SEARCHING_REMOVE_ITEM, id: id})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( (formikEnhancer(GalleryForm)), axios ));
