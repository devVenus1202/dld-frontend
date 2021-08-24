import { createAction } from 'redux-actions';

export const cartListWithoutLoginActions = {
    CART_LIST_WITHOUT_LOGIN_REQUEST: 'CART_LIST_WITHOUT_LOGIN Requested!',
    CART_LIST_WITHOUT_LOGIN_SUCCESS: 'CART_LIST_WITHOUT_LOGIN in successfully!',
    CART_LIST_WITHOUT_LOGIN_FAILED: 'CART_LIST_WITHOUT_LOGIN failed!',
    CART_LIST_WITHOUT_LOGIN_START: 'CART_LIST_WITHOUT_LOGIN Started!',
}

export const cartListWithLoginActions =
{
    CART_LIST_WITH_LOGIN_START: 'CART_LIST_WITH_LOGIN Started!',
    CART_LIST_WITH_LOGIN_REQUEST: 'CART_LIST_WITH_LOGIN Requested!',
    CART_LIST_WITH_LOGIN_SUCCESS: 'CART_LIST_WITH_LOGIN in successfully!',
    CART_LIST_WITH_LOGIN_FAILED: 'CART_LIST_WITH_LOGIN failed!',
}

   

export const cartListWithoutLoginRequest = createAction(cartListWithoutLoginActions.CART_LIST_WITHOUT_LOGIN_REQUEST);
export const cartListWithoutLoginStarted = createAction(cartListWithoutLoginActions.CART_LIST_WITHOUT_LOGIN_START);
export const cartListWithoutLoginSuccess = createAction(cartListWithoutLoginActions.CART_LIST_WITHOUT_LOGIN_SUCCESS);
export const cartListWithoutLoginFailed = createAction(cartListWithoutLoginActions.CART_LIST_WITHOUT_LOGIN_FAILED);

export const cartListWithLoginRequest = createAction(cartListWithLoginActions.CART_LIST_WITH_LOGIN_REQUEST);
export const cartListWithLoginStarted = createAction(cartListWithLoginActions.CART_LIST_WITH_LOGIN_START);
export const cartListWithLoginSuccess = createAction(cartListWithLoginActions.CART_LIST_WITH_LOGIN_SUCCESS);
export const cartListWithLoginFailed = createAction(cartListWithLoginActions.CART_LIST_WITH_LOGIN_FAILED);
