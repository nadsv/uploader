import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './Home.css';

const home = () => (
    <ul className={classes.home}>
        <li className={classes.home__item}><NavLink to="/document">Документ</NavLink></li>
        <li className={classes.home__item}><NavLink to="/news">Новость</NavLink></li>
        <li className={classes.home__item}><NavLink to="/gallery">Фотогалерея</NavLink></li>
    </ul>
);

export default home;
