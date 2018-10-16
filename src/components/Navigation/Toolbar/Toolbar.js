import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './Toolbar.css';
import NavigationItems from '../NavigationItems/NavigationItems';

const toolbar = ( props ) => (
    <header className={classes.Toolbar}>
        <div className={classes.Logo}>
            <NavLink to="/" exact>
              UPLOADER
            </NavLink>
        </div>
        <nav>
            <NavigationItems />
        </nav>
    </header>
);

export default toolbar;
