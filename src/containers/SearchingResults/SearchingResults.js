import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

import classes from './SearchingResults.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actionTypes from '../../store/actions/actionTypes';

class SearchingResults extends Component {

  clickHandler(item) {
    switch (item.category.label) {
      case 'Новость':
        this.props.history.push('/news')
        this.props.onInitNews(item)
        break;
      default:
        this.props.onInitDoc(item)
        this.props.history.push('/document')
        break;
    }
  }

  render() {
    let result = this.props.items && <table className={classes.heavyTable}>
        <thead>
          <tr>
            <th>Название</th>
            <th className={classes.td__fixed}>Категория</th>
            <th className={classes.td__fixed}>Подкатегория</th>
            <th className={classes.td__fixed}>Сотрудник</th>
            <th className={classes.td__fixed}>Дата</th>
          </tr>
        </thead>
        <tbody>
          {this.props.items.map(item => <tr key={item.id} onClick={()=>this.clickHandler(item)}>
              <td>{item.docName}</td>
              <td>{item.category.label}</td>
              <td>{item.subCategory.label}</td>
              <td>{item.user}</td>
              <td>{item.date}</td>
            </tr>)}
        </tbody>
      </table>
    if ( this.props.loading ) {
        result = <Spinner />
    }
    return result
  }
}

const mapStateToProps = state => {
    return {
        items: state.searching.items,
        loading: state.searching.resultsLoading,
        error: state.searching.error
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitDoc: (item) => dispatch({type: actionTypes.INIT_DOC, item: item}),
        onInitNews: (item) => dispatch({type: actionTypes.INIT_NEWS, item: item}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchingResults));
