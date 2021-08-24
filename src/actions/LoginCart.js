import { createAction } from 'redux-actions';

export const loginCartActions = {
    LOGIN_CART_REQUEST: 'Login Cart Requested!',
    LOGIN_GIFT_CART_REQUEST: 'Login Gift Cart Requested!',
}

export const loginCartRequest = createAction(loginCartActions.LOGIN_CART_REQUEST);
export const loginGiftCartRequest = createAction(loginCartActions.LOGIN_GIFT_CART_REQUEST);
