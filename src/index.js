import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import doc from './store/reducers/document';
import searching from './store/reducers/searching';

const rootReducer = combineReducers({
    doc,
    searching
});

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const app = (
    <Provider store={store}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <App />
        </BrowserRouter>
    </Provider>
);


ReactDOM.render( app, document.getElementById( 'root' ) );
registerServiceWorker();
