import React, { Component } from 'react';
import { connect } from 'react-redux';
import { convertToRaw } from 'draft-js';
import RichTextEditor from 'react-rte';

import { withFormik, Form } from 'formik';
import * as Yup from 'yup';

import Spinner from '../../components/UI/Spinner/Spinner';
import Button from '../../components/UI/Button/Button';
import Uselect from '../../components/UI/Uselect/Uselect';
import MultipleFileLoader from '../../components/UI/MultipleFileLoader/MultipleFileLoader';
import NewsImageLoader from '../../components/UI/NewsImageLoader/NewsImageLoader';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../uploader-axios';
import classes from '../../shared/forms.css';
import * as actionTypes from '../../store/actions/actionTypes';
import './NewsForm.css';

const formikEnhancer = withFormik({
  mapPropsToValues(props) {
      return {
        docName: props.docName || '',
        date: props.date || '',
        user: props.user || '',
        hidden: props.hidden || '',
        text: props.text || null,
        fileNames: props.fileNames || [],
        image: props.image || ''
      }
    },

  validationSchema: Yup.object().shape({
    docName: Yup.string().min(5, 'Заголовок должен содержать не менее 5 символов.').required('Заголовок не заполнен.'),
    user: Yup.string().min(5, 'ФИО должны содержать более 5 символов.').required('ФИО не заполнены.'),
    date: Yup.date().required('Дата не заполнена.'),
    text: Yup.object().test(
        'text',
        'Текст новости не заполнен.',
        value => { if (value.blocks[0].text) {return true} else {return false} }
      ),
    hidden: Yup.mixed().test(
        'category',
        'Отображение не заполнено.',
        value => { if (value) {return true} else {return false} }
      ).required('Отображение не заполнено.')
  })
});

const valuesInUselect = [{value: 'Да', label: 'Да'}, {value: 'Нет', label: 'Нет'}];

class NewsForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
         deleting: false,
         text: RichTextEditor.createEmptyValue(),
         files: []
     }
     this.filesWithLinks = []
     this.image = null
  }

  componentDidMount() {
      if (this.props.news) {
        this.props.setFieldValue('docName', this.props.news.docName)
        this.props.setFieldValue('user', this.props.news.user)
        const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        const dt = new Date(this.props.news.date.replace(pattern,'$3-$2-$1'));
        this.props.setFieldValue('date', dt.toISOString().substring(0,10))
        this.props.setFieldValue('hidden', this.props.news.hidden)
        this.props.setFieldValue('image', this.props.news.image)
        this.props.setFieldValue('fileNames', this.props.news.fileNames)

        let text = this.state.text;
        this.setState({
          text: text.setContentFromString(JSON.stringify(this.props.news.text), 'raw'),
        });
        //this.props.setFieldValue('text', text.setContentFromString(JSON.stringify(this.props.news.text), 'raw'));
    }
  }

  componentWillUnmount() {
    this.props.onInitNews(null);
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

  handleFilesAddition = (files, fileNames) => {
      this.setState( { files });
      this.props.setFieldValue('fileNames', fileNames);
  }

  handleFilesDeletion = (files, fileNames) => {
      this.setState( { files });
      this.props.setFieldValue('fileNames', fileNames);
  }

  imageChangeHandler = (image) => {
    this.image = image
    if (image) {
      this.props.setFieldValue('image', 'image');
    } else {
      this.props.setFieldValue('image', '');
    }
  }

  submitHandler = ( event ) => {
      event.preventDefault();
      const formData = new FormData()
      let newsData = { ...this.props.values }
      newsData.id = (this.props.news) ? this.props.news.id : ''
      newsData.folder = (this.props.news) ? this.props.news.folder : ''
      newsData.html = this.state.text.toString('html')
      formData.append('news', JSON.stringify(newsData));
      let i = 0;
      for (const file of this.state.files) {
          formData.append('file' + i, file)
          i++;
      }
      if (this.image || this.image==='') { formData.append('image', this.image) }
      this.props.onOperationStart();
      axios.post('api/save-news.php', formData)
           .then((response)=>{
              const docData = {...this.props.values,
                                  id: response.data.id.$id || this.props.news.id,
                                  folder: response.data.folder || newsData.folder
                              }
              this.props.onNewsSaveSuccess(docData);
              const newData = { ...docData };
              newData.category = {label: 'Новость', value: 'news'}
              newData.subCategory = {label: 'Новость', value: 'news'}
              newData.date = this.props.news.date.replace(/(\d{4})-(\d{2})-(\d{2})/,'$3.$2.$1')
              this.props.onSearchingUpdateItem( newData )
           }).catch((error)=> {
              this.props.onOperationFail();
              console.log(error)
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
        <div className={classes.formGroup}>
          <label className={classes.label}>Прикрепленные файлы</label>
          <MultipleFileLoader
            Add = { this.handleFilesAddition }
            Delete = { this.handleFilesDeletion }
            filesWithLinks = { (this.props.news) ? this.props.news.fileNames : [] }
            link = { (this.props.news) ?  this.props.path + this.props.news.folder : ''}
          />
          { errors.fileNames && <p className={classes.invalid}>{errors.fileNames}</p> }
        </div>
        <div className={classes.formGroup}>
          <label className={classes.label}>Изображение</label>
          <NewsImageLoader
              show = {(this.props.news) ? this.props.news.image : ''}
              imageChangeHandler = { this.imageChangeHandler }
              link = { (this.props.news) ?  this.props.path + this.props.news.folder + '/image.jpeg' : ''}
          />
          { errors.image && <p className={classes.invalid}>{errors.image}</p> }
        </div>
        <Button btnType="Success"
                type="submit"
                disabled={!dirty || isSubmitting || !isValid}>
          Сохранить документ
        </Button>
    </Form>
    if ( this.props.loading ) {
        form = <Spinner />
    }
    return <div className={classes.wrapper}>
       <h1>Новость</h1>
       {form}
     </div>
 ;
}
}

const mapStateToProps = state => {
    return {
        error: state.news.error,
        loading: state.news.loading,
        news: state.news.news,
        path: state.news.path
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onOperationStart: () => dispatch({type: actionTypes.OPERATION_START}),
        onOperationFail: () => dispatch({type: actionTypes.OPERATION_FAIL}),
        onNewsSaveSuccess: (data) => dispatch({type: actionTypes.SAVE_NEWS_SUCCESS, data: data}),
        onInitNews: (data) => dispatch({type: actionTypes.INIT_NEWS, data: data}),
        onSearchingUpdateItem: (docData) => dispatch({type: actionTypes.SEARCHING_UPDATE_ITEM, docData: docData})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( (formikEnhancer(NewsForm)), axios ));
