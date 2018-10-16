import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    doc: null,
    categories: [],
    loading: true,
    error: false,
    path: process.env.REACT_APP_DOC_URL
};

const setCategories = (state, action) => {
    return updateObject( state, {
        categories: action.categories,
        error: false,
        loading: false
    } );
};

const operationStart = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const operationFail = ( state, action ) => {
    return updateObject( state, { error: true, loading: false } );
};

const saveDocSuccess = ( state, action ) => {
    const newDoc = updateObject( action.docData );
    return updateObject( state, {
        loading: false,
        error: false,
        doc: newDoc
    } );
};

const deleteDocSuccess = ( state, action ) => {
    return updateObject( state, {
        doc: null,
        loading: false,
        error: false
    } );
};

const initDoc = (state, action) =>{
    return updateObject( state, {
        doc: action.item,
        loading: false,
        error: false
    } );
}

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.SET_CATEGORIES: return setCategories(state, action);
        case actionTypes.OPERATION_START: return operationStart(state, action);
        case actionTypes.OPERATION_FAIL: return operationFail(state, action);
        case actionTypes.SAVE_DOC_SUCCESS: return saveDocSuccess(state, action);
        case actionTypes.DELETE_DOC_SUCCESS: return deleteDocSuccess(state, action);
        case actionTypes.INIT_DOC: return initDoc(state, action);
        default: return state;
    }
};

export default reducer;
