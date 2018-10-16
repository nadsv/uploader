import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    items: null,
    loading: false,
    error: false,
    params: null
};

const findItemsSuccess = ( state, action ) => {
    return updateObject( state, {
        loading: false,
        error: false,
        items: action.items
    } );
};

const searchingInit = (state, action) => {
  return updateObject( state, {
      loading: false,
      error: false,
      params: action.params
  } );
}

const searchingStart = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const searchingFail = ( state, action ) => {
    return updateObject( state, { error: true, loading: false } );
};

const searchingRemoveItem = (state, action) => {
    let array = state.items.filter(item => item.id!==action.id );
    return updateObject( state, { items: array } );
};

const  searchingUpdateItem = (state, action) => {
    let array = (state.items)?state.items.map(item => (item.id !== action.docData.id) ? item : action.docData):null;
    return updateObject( state, { items: array } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.SEARCHING_SUCCESS: return findItemsSuccess(state, action);
        case actionTypes.SEARCHING_START: return searchingStart(state, action);
        case actionTypes.SEARCHING_FAIL: return searchingFail(state, action);
        case actionTypes.SEARCHING_INIT: return searchingInit(state, action);
        case actionTypes.SEARCHING_UPDATE_ITEM: return searchingUpdateItem(state, action);
        case actionTypes.SEARCHING_REMOVE_ITEM: return searchingRemoveItem(state, action);
        default: return state;
    }
};

export default reducer;
