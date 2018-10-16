import React, { PureComponent } from 'react';

import Button from '../../components/UI/Button/Button';

class FileLoader extends PureComponent {
  state = {
    selectedFile: null,
    fileInput: null,
    fileState: 'empty'
  }

  componentDidUpdate(prevProps) {
    let state = (this.props.linkToFile)?'loaded':this.state.fileState;
    state = (this.props.linkToFile === '' && prevProps.linkToFile !== '') ?'empty':state;
    this.setState({fileState: state})
  }

  fileChangedHandler = (event) => {
    this.setState({selectedFile: event.target.files[0]})
    if (event.target.files[0].size>5242880) {
      this.props.onSelectFile(' ')
      this.setState({fileState: 'empty'})
    }
    else {
      this.props.onSelectFile(event.target.files[0].name, event.target.files[0])
      this.setState({fileState: 'loaded'})
    }
  }

  fileDeleteHandler = () => {
    this.props.onSelectFile('')
    this.setState({selectedFile: null, fileInput: null, fileState: 'empty'})
    this.props.onDeleteFile();
  }

  fileDownloadHandler = () => {
    window.open(this.props.linkToFile, '_blank')
  }

  render() {
    let content = '';
    const uploadBtn = <Button type="button"
            clicked={() => this.fileInput.click()}
            size="small"
            btnType="Info">
            Выбрать файл
    </Button>;
    const downloadBtn = <Button
            type="button"
            clicked={this.fileDownloadHandler}
            size="small"
            btnType="Info">
            Скачать файл
    </Button>;
    const deleteBtn = <Button type="button"
            clicked={this.fileDeleteHandler}
            size="small"
            btnType="Info">
            Удалить файл
    </Button>;
    switch (this.state.fileState) {
      case 'empty':
        content = <div>
          <input type="file"
                 style={{display: 'none'}}
                 onChange={this.fileChangedHandler}
                 ref={fileInput => this.fileInput = fileInput}
                 accept=".zip, .pdf, .doc, .docx, .xls, .xlsx, .jpg, .jpeg, .tiff, .tif, .txt"
                 />
          {uploadBtn}
          </div>;
        break;
      case 'loaded':
      content = <div>
          {deleteBtn}
          {(this.props.linkToFile) && downloadBtn}
        </div>;
        break;
      default: break;
    }
    return content;
  }
}

export default FileLoader;
