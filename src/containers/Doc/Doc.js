import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withFormik, Form } from 'formik';
import * as Yup from 'yup';

import Spinner from '../../components/UI/Spinner/Spinner';
import Uselect from '../../components/UI/Uselect/Uselect';
import Button from '../../components/UI/Button/Button';
import DelModal from '../../components/UI/DelModal/DelModal';
import FileLoader from '../../containers/FileLoader/FileLoader'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../uploader-axios';
import classes from '../../shared/forms.css';
import * as actionTypes from '../../store/actions/actionTypes';

const formikEnhancer = withFormik({
  mapPropsToValues(props) {
      return {
        docName: props.docName || '',
        user: props.user || '',
        file: props.file || '',
        category: props.category || '',
        subCategory: props.subCategory || ''
      }
    },

  validationSchema: Yup.object().shape({
    docName: Yup.string().min(10, 'Название документа должно содержать не менее 10 символов.').required('Название документа не заполнено.'),
    user: Yup.string().min(5, 'ФИО должны содержать более 5 символов.').required('ФИО не заполнены.'),
    file: Yup.string().test(
        'fileSize',
        'Размер файла больше 5МБ.',
        value =>  (value === ' ')? false: true
      ).required('Файл не выбран.'),
    category: Yup.mixed().test(
        'category',
        'Не заполнена категория.',
        value => { if ((value !== undefined ) && value.link === '') {return false} else {return true} }
      ).required('Не заполнена категория.'),
    subCategory: Yup.mixed().test(
        'subCategory',
        'Не заполнена подкатегория.',
        value => { if ((value !== undefined ) && value.link === '') {return false} else {return true} }
      ).required('Не заполнена подкатегория.')
  })
});

class Doc extends Component {
  state = {
    categories: [],
    subCategories: [],
    tempFile: null,
    linkToFile: '',
    deleting: false
  }

  componentDidMount() {
    if (this.props.categories.length === 0) {
      axios.get('/api/get-categories.php' )
          .then( response => this.props.onSetCategories(response.data))
          .catch( error => this.props.onOperationFailed());
    } else {
      this.initCategoriesInDocForm(this.props.categories);
      if (this.props.doc) {
        this.props.setFieldValue('docName', this.props.doc.docName)
        this.props.setFieldValue('user', this.props.doc.user)
        this.props.setFieldValue('file', this.props.doc.file)
        this.props.setFieldValue('category', this.props.doc.category)
        this.props.setFieldValue('subCategory', this.props.doc.subCategory)
        this.setState({linkToFile: this.props.path+'/'+this.props.doc.category.value+'/'+this.props.doc.subCategory.value+'/'+this.props.doc.fsFileName})
      }
    }
  }

  componentDidUpdate(prevProps) {
      const ctgs = this.props.categories;
      if (ctgs.length !== prevProps.categories.length && ctgs.length) {
        this.initCategoriesInDocForm(ctgs);
    }
  }

  componentWillUnmount() {
    this.props.onInitDoc(null);
  }

   initCategoriesInDocForm = (ctgs) => {
    let categories = ctgs.map(
      (cat) => ({value: cat.link, label: cat.name})
    );
    const updateCategories = [{name: '', link: ''}].concat(categories);
    this.setState({categories: updateCategories});
  }

  categoryBlurHandler = (link) => {
     if (link) {
       const ctgs = this.props.categories;
       this.props.setFieldTouched('category', true)
       const updatedSubCategories = ctgs.filter(cat => cat.link === link)[0].subCategory.map(
         (cat) => ({value: cat.link, label: cat.name})
       );
       this.setState({subCategories: updatedSubCategories});
     }
     this.props.setFieldValue('subCategory', {link: '', subCategory: ''});
   }

   categoryChangeHandler = (value) => {
      this.props.setFieldValue('category', value)
      this.props.setFieldValue('subCategory', {link: '', subCategory: ''});
    }

    handleFile = (file, tempFile) => {
        this.props.setFieldValue('file', file);
        this.props.setFieldTouched('file', true);
        this.tempFile = tempFile;
    }

    handleDeleteFile = () => {
        this.setState({linkToFile: ''})
    }

    submitHandler = ( event ) => {
          event.preventDefault();
          const formData = new FormData()
          const docData = {...this.props.values,
                          id: (this.props.doc)?this.props.doc.id: '',
                          fsFileName: (this.props.doc)?this.props.doc.fsFileName: ''
                          }
          formData.append('doc', JSON.stringify(docData));
          formData.append('file', this.tempFile);
          if (this.props.doc) {formData.append('id', this.props.doc.id);}
          this.props.onOperationStart();
          axios.post('api/save-doc.php', formData)
               .then((response)=>{
                  const docData = {...this.props.values,
                                      id: response.data.id.$id || this.props.doc.id,
                                      fsFileName: response.data.fsFileName || this.props.doc.fsFileName,
                                      date: response.data.date || this.props.doc.date
                                  }
                  this.props.onDocSaveSuccess(docData);
                  this.props.onSearchingUpdateItem( docData );
                  this.setState({linkToFile: this.props.path+'/'+this.props.values.category.value+'/'+this.props.values.subCategory.value+'/'+response.data.fsFileName})
               }).catch((error)=> {
                  this.props.onOperationFail();
               });
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
      const data = JSON.stringify({id: this.props.doc.id, link: this.props.doc.category.value+'/'+this.props.doc.subCategory.value+'/'+this.props.doc.fsFileName});
      axios.post('api/delete-doc.php', data)
           .then((response)=>{
              if (response) {
                this.props.onDocDeleteSuccess();
                this.props.onSearchingRemoveItem(response.data.id.$id);
                this.setState({linkToFile: '', tempFile: null});
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
            <label className={classes.label}>Название документа</label>
            <textarea name="docName"
              className={classes.field}
              value={values.docName}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="7"/>
              { touched.docName && errors.docName && <p className={classes.invalid}>{errors.docName}</p> }
          </div>
          <div className={classes.formGroup}>
            <label className={classes.label}>Категория</label>
            <Uselect
              value={values.category}
              name="category"
              onChange={setFieldValue}
              onBlur={() => this.categoryBlurHandler(values.category.value)}
              error={errors.category}
              options = {this.state.categories}
              touched={touched.category}
            />
            { touched.category && errors.category && <p className={classes.invalid}>{errors.category}</p> }
          </div>
          <div className={classes.formGroup}>
            <label className={classes.label}>Подкатегория</label>
            <Uselect
              value={values.subCategory}
              name="subCategory"
              onChange={setFieldValue}
              onBlur={setFieldTouched}
              error={errors.subCategory}
              options = {this.state.subCategories}
              touched={touched.subCategory}
            />
            { touched.subCategory && errors.subCategory && <p className={classes.invalid}>{errors.subCategory}</p> }
          </div>
          <div className={classes.formGroup}>
            <label className={classes.label}>ФИО добавившего документ</label>
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
          <div className={classes.formGroup}>
            <label className={classes.label}>Файл</label>
            <input
              type="text"
              name="file"
              value={values.file}
              className={classes.field}
              onChange={handleChange}
              onBlur={handleBlur}
              readOnly
              />
              { touched.file && errors.file && <p className={classes.invalid}>{errors.file}</p> }
          </div>
          <FileLoader onSelectFile = {this.handleFile} linkToFile={this.state.linkToFile} onDeleteFile={this.handleDeleteFile}/>
          <Button btnType="Success"
                  type="submit"
                  disabled={!dirty || isSubmitting || !isValid}>
            Сохранить документ
          </Button>
          {this.props.doc && <Button btnType="Success" type="button" clicked={this.deleteHandler}>
                              Удалить документ
                             </Button>}
          {this.props.doc && this.props.doc.date && <p className={classes.info}>Документ добавлен {this.props.doc.date}</p>}
      </Form>
      if ( this.props.loading ) {
          form = <Spinner />
      }
      return <div className={classes.wrapper}>
         <DelModal show={this.state.deleting}
                   cancelHandler={this.cancelDeleteHandler}
                   confirmHandler={this.confirmDeleteHandler}>
         </DelModal>
         <h1>Документ</h1>
         {form}
       </div>
   ;
  }
};

const mapStateToProps = state => {
    return {
        categories: state.doc.categories,
        error: state.doc.error,
        loading: state.doc.loading,
        doc: state.doc.doc,
        path: state.doc.path
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onSetCategories: (data) => dispatch({type: actionTypes.SET_CATEGORIES, categories: data}),
        onOperationStart: () => dispatch({type: actionTypes.OPERATION_START}),
        onOperationFail: () => dispatch({type: actionTypes.OPERATION_FAIL}),
        onDocSaveSuccess: (docData) => dispatch({type: actionTypes.SAVE_DOC_SUCCESS, docData: docData}),
        onDocDeleteSuccess: () => dispatch({type: actionTypes.DELETE_DOC_SUCCESS}),
        onInitDoc: (docData) => dispatch({type: actionTypes.INIT_DOC, docData: docData}),
        onSearchingUpdateItem: (docData) => dispatch({type: actionTypes.SEARCHING_UPDATE_ITEM, docData: docData}),
        onSearchingRemoveItem: (id) => dispatch({type: actionTypes.SEARCHING_REMOVE_ITEM, id: id})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( (formikEnhancer(Doc)), axios ));
