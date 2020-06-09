import { createAction } from 'redux-actions';

export const signUpCartActions = {
    SIGNUP_CART_REQUEST: 'Sign up Cart Requested!',
    SIGNUP_GIFT_CART_REQUEST: 'Sign up Gift Cart Requested!',
}

export const signUpCartRequest = createAction(signUpCartActions.SIGNUP_CART_REQUEST);
export const signUpGiftCartRequest = createAction(signUpCartActions.SIGNUP_GIFT_CART_REQUEST);
