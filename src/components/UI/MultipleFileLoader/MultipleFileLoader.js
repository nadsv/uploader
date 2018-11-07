import React, { PureComponent } from 'react';

import classes from './MultipleFileLoader.css';
import Button from '../Button/Button';
import ErrorModal from '../ErrorModal/ErrorModal';

class MultipleFileLoader extends PureComponent {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      files: [],
      fileNames: [],
      message: ''
    };
    this.filesWithLinks = [];
  }

  onAdd = (event) => {
    const size_is_large = Object.values(event.target.files).filter(file => file.size > 5242880*2).length > 0;
    if (size_is_large) {
      this.setState({ message: 'Список содержит файл размером более 10МБ!' });
      return
    }
    const fileNames =  Object.values(event.target.files).map(file => file.name).concat(this.state.fileNames);
    const uniqueNames = [...new Set(fileNames)];
    if (uniqueNames.length === fileNames.length) {
      let files = Object.values(event.target.files).concat(this.state.files);
      this.props.Add(files, fileNames);
      this.setState({ fileNames, files })
    } else {
      this.setState({ message: 'Список не должен содержать файлы с одинаковыми именами!' })
    }
  };

  onDelete = (index, fileName) => {
    const fileNames = this.state.fileNames.filter((file, i) => i !== index)
    const files = this.state.files.filter(file => file.name !== fileName)
    this.setState({ fileNames, files })
    this.props.Delete(files, fileNames)
  }

  confirmErrorHandler = () => {
    this.setState({message: ''})
  }

  componentDidUpdate(prevProps) {
    this.setState({fileNames: this.props.fileNames});
    this.filesWithLinks = this.props.fileNames;
  }

  componentDidMount() {
    this.setState({fileNames: this.props.fileNames});
    this.filesWithLinks = this.props.fileNames;
  }

  render() {
    const list = this.state.fileNames.map((item, index)=>{
      let file = this.filesWithLinks.includes(item) ? <a href={this.props.link + '/' + item} target="_blank">{item}</a>: item;
      return (<li key={item} className={classes.item}>
        { file }
        <span className={classes.delBtn}
              onClick={ () => this.onDelete(index, item) }>
        x
        </span>
      </li>)
   });

    return (<React.Fragment>
      <ErrorModal show={this.state.message}
                  message={this.state.message}
                  cancelHandler={this.confirmErrorHandler}>
      </ErrorModal>
        <input type="file"
            style={{display: 'none'}}
            ref = { item => this.fileInput = item }
            onChange = { this.onAdd }
            multiple
            accept=".zip, .pdf, .doc, .docx, .xls, .xlsx, .jpg, .jpeg, .tiff, .tif, .txt"
        />
        <div className = { classes.btn }>
            <Button size="small"
                    type="button"
                    btnType="Info"
                    clicked={() => this.fileInput.click()}
            >
                        Прикрепить файлы

            </Button>
        </div>
        <ul className = { classes.fileList}>
            { list }
        </ul>
     </React.Fragment>)
  }
};

export default MultipleFileLoader;
