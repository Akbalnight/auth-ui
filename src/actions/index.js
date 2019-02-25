import * as types from '../constants/actionTypes'

//AUTH
export const authRequestStart = () => (dispatch) => dispatch({type: types.AUTH_REQUEST_START});
export const authRequestResult = (result) => (dispatch) => dispatch({type: types.AUTH_REQUEST_RESULT, result: result});
