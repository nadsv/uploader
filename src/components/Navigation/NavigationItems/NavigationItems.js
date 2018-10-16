import React from 'react';

import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = () => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/" exact>Загрузить</NavigationItem>
        <NavigationItem link="/searching">Найти</NavigationItem>
    </ul>
);

export default navigationItems;
