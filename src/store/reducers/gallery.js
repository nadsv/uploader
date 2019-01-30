import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    gallery: null,
    loading: false,
    error: false,
    path: process.env.REACT_APP_GALLERY_URL
};

const operationStart = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const operationFail = ( state, action ) => {
    return updateObject( state, { error: true, loading: false } );
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

const deleteGalleryPhoto = (state, action) => {
  return state
}

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.OPERATION_START: return operationStart(state, action);
        case actionTypes.OPERATION_FAIL: return operationFail(state, action);
        case actionTypes.SAVE_GALLERY_SUCCESS: return saveGallerySuccess(state, action);
        case actionTypes.INIT_GALLERY: return initGallery(state, action);
        case actionTypes.DELETE_GALLERY: return deleteGallery(state, action);
        case actionTypes.DELETE_GALLERY_PHOTO: return deleteGalleryPhoto(state, action);
        default: return state;
    }
};

export default reducer;
