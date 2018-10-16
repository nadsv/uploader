import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withFormik, Form } from 'formik';
import * as Yup from 'yup';

import Spinner from '../../components/UI/Spinner/Spinner';
import Uselect from '../../components/UI/Uselect/Uselect';
import Button from '../../components/UI/Button/Button';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../uploader-axios';
import classes from '../../shared/forms.css';
import * as actionTypes from '../../store/actions/actionTypes';

const formikEnhancer = withFormik({
  mapPropsToValues(props) {
      return {
        docName: props.docName || '',
        user: props.user || '',
        category: props.category || '',
        subCategory: props.subCategory || '',
        end: props.end || '',
        start: props.start || ''
      }
    },

  validationSchema: Yup.object().shape({
    category: Yup.mixed().test(
        'category',
        'Не заполнена категория.',
        value => { if ((value !== undefined ) && value.link === '') {return false} else {return true} }
      ).required('Не заполнена категория.')
  })
});

class SearchingParams extends Component {
  state = {
    categories: [],
    subCategories: []
  }

  componentDidMount() {
    if (this.props.categories.length === 0) {
      axios.get( 'api/get-categories.php' )
          .then( response => this.props.onSetCategories(response.data))
          .catch( error => this.props.onOperationFailed());
    } else {
      this.initCategoriesInDocForm(this.props.categories);
    }
    if (this.props.params) {
      for (const key in this.props.params) {
         this.props.setFieldValue(key, this.props.params[key])
      }
    }
  }

  componentWillUnmount() {
    this.props.onSearchingInit(this.props.values)
  }

  componentDidUpdate(prevProps) {
      const ctgs = this.props.categories;
      if (ctgs.length !== prevProps.categories.length && ctgs.length) {
        this.initCategoriesInDocForm(ctgs);
    }
  }

   initCategoriesInDocForm = (ctgs) => {
    let categories = ctgs.map(
      (cat) => ({value: cat.link, label: cat.name})
    );
    const updateCategories = [{label: '', value: ''}]
    .concat(categories)
    .concat([{label: 'Новость', value: 'news'}, {label: 'Галерея', value: 'gallery'}]);
    this.setState({categories: updateCategories});
  }

  categoryBlurHandler = (link) => {
     if (link !=='' && link !=='news' && link !=='gallery') {
       const ctgs = this.props.categories;
       this.props.setFieldTouched('category', true)
       const updatedSubCategories = ctgs.filter(cat => cat.link === link)[0].subCategory.map(
         (cat) => ({value: cat.link, label: cat.name})
       );
       this.setState({subCategories: updatedSubCategories});
     } else {
       this.setState({subCategories: []});
     }
     this.props.setFieldValue('subCategory', {value: '', label: ''});
   }

   categoryChangeHandler = (value) => {
      this.props.setFieldValue('category', value)
      this.props.setFieldValue('subCategory', {value: '', label: ''});
    }


    submitHandler = ( event ) => {
          event.preventDefault();
          this.props.onSearchingInit(this.props.values);
          this.props.onOperationStart();
          axios.post('api/get-items.php', JSON.stringify(this.props.values))
               .then((response)=>{
                 if (response) {
                  this.props.onSearchingSuccess(response.data);
                } else {
                  this.props.onOperationFail();
                }
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
              rows="3"/>
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
          </div>
          <div className={classes.formGroup}>
            <label className={classes.label}>Дата добавления C</label>
            <input
              type="date"
              name="start"
              className={classes.field}
              value={values.start}
              onChange={handleChange}
              onBlur={handleBlur}
              />
          </div>
          <div className={classes.formGroup}>
            <label className={classes.label}>Дата добавления ПО</label>
            <input
              type="date"
              name="end"
              className={classes.field}
              value={values.end}
              onChange={handleChange}
              onBlur={handleBlur}
              />
          </div>
          <Button btnType="Success"
                  type="submit"
                  disabled={!dirty || isSubmitting || !isValid}>
            Найти
          </Button>
      </Form>
      if ( this.props.loading ) {
          form = <Spinner />
      }
      return form
   ;
  }
};

const mapStateToProps = state => {
    return {
        categories: state.doc.categories,
        error: state.doc.error,
        loading: state.doc.loading,
        items: state.searching.items,
        docPath: state.searching.path,
        params: state.searching.params
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onSetCategories: (data) => dispatch({type: actionTypes.SET_CATEGORIES, categories: data}),
        onOperationStart: () => dispatch({type: actionTypes.SEARCHING_START}),
        onOperationFail: () => dispatch({type: actionTypes.SEARCHING_FAIL}),
        onSearchingSuccess: (items) => dispatch({type: actionTypes.SEARCHING_SUCCESS, items: items}),
        onSearchingInit: (params) => dispatch({type: actionTypes.SEARCHING_INIT, params: params})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( (formikEnhancer(SearchingParams)), axios ));
