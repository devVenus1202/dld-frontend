import { createAction } from 'redux-actions';

export const singleProductDeleteActions = {
    SINGLE_PRODOUCT_CART_DELETE_REQUEST: 'SINGLE_PRODOUCT_CART_DELETE Requested!',
    SINGLE_PRODOUCT_CART_DELETE_SUCCESS: 'SINGLE_PRODOUCT_CART_DELETE in successfully!',
    SINGLE_PRODOUCT_CART_DELETE_FAILED: 'SINGLE_PRODOUCT_CART_DELETE failed!',
    SINGLE_PRODOUCT_CART_DELETE_START: 'SINGLE_PRODOUCT_CART_DELETE Started!'
}

export const singleProductDeleteRequest = createAction(categoryListActions.SINGLE_PRODOUCT_CART_DELETE_REQUEST);
export const singleProductDeleteStarted = createAction(categoryListActions.SINGLE_PRODOUCT_CART_DELETE_START);
export const singleProductDeleteSuccess = createAction(categoryListActions.SINGLE_PRODOUCT_CART_DELETE_SUCCESS);
export const singleProductDeleteFailed = createAction(categoryListActions.SINGLE_PRODOUCT_CART_DELETE_FAILED);
