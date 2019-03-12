import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    gallery: null,
    loading: false,
    error: false,
    itemLoading: false,
    itemError: false,
    path: process.env.REACT_APP_GALLERY_URL
};

const operationStart = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const operationFail = ( state, action ) => {
    return updateObject( state, { error: true, loading: false } );
};

const loadingItemStart = ( state, action ) => {
    return updateObject( state, { itemLoading: true } );
};

const loadingItemFail = ( state, action ) => {
    return updateObject( state, { imageError: true, itemLoading: false } );
};


const saveGallerySuccess = ( state, action ) => {
    const data = updateObject( action.data );
    return updateObject( state, {
        loading: false,
        error: false,
        gallery: data
    } );
};

const initGallery = (state, action) =>{
    return updateObject( state, {
        gallery: action.item,
        loading: false,
        error: false
    } );
}


const deleteGallery = (state, action) => {
  return updateObject( state, {
      gallery: null,
      loading: false,
      error: false
  } );
}

const changeItemSuccess = ( state, action ) => {
    const data = updateObject( action.data );
    return updateObject( state, {
        itemLoading: false,
        itemFail: false,
        gallery: data
    } );
};



const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.OPERATION_START: return operationStart(state, action);
        case actionTypes.OPERATION_FAIL: return operationFail(state, action);
        case actionTypes.LOADING_ITEM_START: return loadingItemStart(state, action);
        case actionTypes.LOADING_ITEM_FAIL: return loadingItemFail(state, action);
        case actionTypes.SAVE_GALLERY_SUCCESS: return saveGallerySuccess(state, action);
        case actionTypes.INIT_GALLERY: return initGallery(state, action);
        case actionTypes.DELETE_GALLERY: return deleteGallery(state, action);
        case actionTypes.CHANGE_ITEM_SUCCESS: return changeItemSuccess(state, action);
        default: return state;
    }
};

export default reducer;
