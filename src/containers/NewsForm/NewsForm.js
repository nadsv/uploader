import React, { Component } from 'react';
import { connect } from 'react-redux';
import { convertToRaw, convertFromRaw, convertFromHTML, ContentState } from 'draft-js';
import RichTextEditor from 'react-rte';
import PropTypes from 'prop-types';

import { withFormik, Form } from 'formik';
import * as Yup from 'yup';

import Spinner from '../../components/UI/Spinner/Spinner';
import Button from '../../components/UI/Button/Button';
import DelModal from '../../components/UI/DelModal/DelModal';
import Uselect from '../../components/UI/Uselect/Uselect';
import FileLoader from '../../containers/FileLoader/FileLoader';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../uploader-axios';
import classes from '../../shared/forms.css';
import * as actionTypes from '../../store/actions/actionTypes';
import './NewsForm.css';

const formikEnhancer = withFormik({
  mapPropsToValues(props) {
      return {
        newsName: props.newsName || '',
        date: props.date || '',
        user: props.user || '',
        hidden: props.hidden || '',
        text: props.text || null
      }
    },

  validationSchema: Yup.object().shape({
    newsName: Yup.string().min(10, 'Заголовок должен содержать не менее 5 символов.').required('Заголовок не заполнен.'),
    user: Yup.string().min(5, 'ФИО должны содержать более 5 символов.').required('ФИО не заполнены.'),
    date: Yup.date().required('Дата не заполнена.'),
    text: Yup.object().test(
        'text',
        'Текст новости не заполнен.',
        value => { if (value.blocks[0].text) {return true} else {return false} }
      ).required('Текст новости не заполнен.'),
    hidden: Yup.mixed().test(
        'category',
        'Отображение не заполнено.',
        value => { if (value) {return true} else {return false} }
      ).required('Отображение не заполнено.')
  })
});

const valuesInUselect = [{value: 'Да', label: 'Да'}, {value: 'Нет', label: 'Нет'}];

class NewsForm extends Component {

 state = {
      deleting: false,
      text: RichTextEditor.createEmptyValue()
  }



  onChangeText = (text) => {
    this.setState( { text } );
    const editorState = text.getEditorState();
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    this.props.setFieldValue('text', rawContentState);
  };

  onBlurText = () => {
    const editorState = this.state.text.getEditorState();
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    this.props.setFieldTouched('text', true);
    this.props.setFieldValue('text', rawContentState);
  }

  testHandler = () => {
    const json = '{"entityMap":{},"blocks":[{"key":"f7339","text":"New value","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}';
    let { text } = this.state;
    this.setState({
      text: text.setContentFromString(json, 'raw'),
    });
  }


  submitHandler = ( event ) => {
        event.preventDefault();
        console.log('submit news');
  }

  cancelDeleteHandler = () => {
    console.log('cancel deleting news');
  }

  confirmDeleteHandler = () => {
    console.log('confirm deleting news');
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
          <textarea name="newsName"
            className={classes.field}
            value={values.newsName}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="3"/>
            { touched.newsName && errors.newsName && <p className={classes.invalid}>{errors.newsName}</p> }
        </div>
        <div className={classes.formGroup}>
          <label className={classes.label}>Текст</label>
          <div className="editor" >
            <RichTextEditor
              value={this.state.text}
              onChange={this.onChangeText}
              onBlur={this.onBlurText}
            />
          </div>
          { touched.text && errors.text && <p className={classes.invalid}>{errors.text}</p> }
        </div>
        <div className={classes.formGroup}>
          <label className={classes.label}>ФИО добавившего новость</label>
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
          <label className={classes.label}>Скрыть новость</label>
          <Uselect
            value={values.hidden}
            name="hidden"
            onChange={setFieldValue}
            onBlur={() => setFieldTouched('hidden', true)}
            error={errors.hidden}
            options = {valuesInUselect}
            touched={touched.hidden}
          />
          { touched.hidden && errors.hidden && <p className={classes.invalid}>{errors.hidden}</p> }
        </div>
        <Button btnType="Success"
                type="submit"
                disabled={!dirty || isSubmitting || !isValid}>
          Сохранить документ
        </Button>
        <Button btnType="Success"
                type="button"
                clicked={this.testHandler}>
         Testing
        </Button>
        {/*this.props.doc && <Button btnType="Success" type="button" clicked={this.deleteHandler}>
                            Удалить новость
                           </Button>}
        {this.props.doc && this.props.doc.date && <p className={classes.info}>Новость добавлена {this.props.doc.date}</p>*/}
    </Form>
    if ( this.props.loading ) {
        form = <Spinner />
    }
    return <div className={classes.wrapper}>
       <DelModal show={this.state.deleting}
                 cancelHandler={this.cancelDeleteHandler}
                 confirmHandler={this.confirmDeleteHandler}>
       </DelModal>
       {form}
     </div>
 ;
}
}

export default connect(null, null)(withErrorHandler( (formikEnhancer(NewsForm)), axios ));
