import React from 'react';

import classes from './Searching.css';
import SearchingResults from '../../containers/SearchingResults/SearchingResults';
import SearchingParams from '../../containers/SearchingParams/SearchingParams';

const searching = () => (
    <div className={classes.searching}>
      <div className={classes.searching__form}>
        <div className={classes.searching__params}>
          <SearchingParams/>
        </div>
      </div>
      <div className={classes.searching__result}>
        <SearchingResults className={classes.searching__data}/>
      </div>
    </div>
);

export default searching;
