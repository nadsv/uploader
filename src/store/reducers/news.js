import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    news: null,
    loading: false,
    error: false,
    path: process.env.REACT_APP_NEWS_URL
};

const operationStart = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const operationFail = ( state, action ) => {
    return updateObject( state, { error: true, loading: false } );
};


const saveNewsSuccess = ( state, action ) => {
    const data = updateObject( action.data );
    return updateObject( state, {
        loading: false,
        error: false,
        news: data
    } );
};

const initNews = (state, action) =>{
    return updateObject( state, {
        news: action.item,
        loading: false,
        error: false
    } );
}

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.OPERATION_START: return operationStart(state, action);
        case actionTypes.OPERATION_FAIL: return operationFail(state, action);
        case actionTypes.SAVE_NEWS_SUCCESS: return saveNewsSuccess(state, action);
        case actionTypes.INIT_NEWS: return initNews(state, action);
        default: return state;
    }
};

export default reducer;
