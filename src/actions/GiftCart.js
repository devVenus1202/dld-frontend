import { createAction } from 'redux-actions';

export const giftCartListWithoutLoginActions = {
    GIFT_CART_LIST_WITHOUT_LOGIN_REQUEST: 'GIFT_CART_LIST_WITHOUT_LOGIN Requested!',
    GIFT_CART_LIST_WITHOUT_LOGIN_SUCCESS: 'GIFT_CART_LIST_WITHOUT_LOGIN in successfully!',
    GIFT_CART_LIST_WITHOUT_LOGIN_FAILED: 'GIFT_CART_LIST_WITHOUT_LOGIN failed!',
    GIFT_CART_LIST_WITHOUT_LOGIN_START: 'GIFT_CART_LIST_WITHOUT_LOGIN Started!',
}

export const giftCartListWithLoginActions =
{
    GIFT_CART_LIST_WITH_LOGIN_START: 'GIFT_CART_LIST_WITH_LOGIN Started!',
    GIFT_CART_LIST_WITH_LOGIN_REQUEST: 'GIFT_CART_LIST_WITH_LOGIN Requested!',
    GIFT_CART_LIST_WITH_LOGIN_SUCCESS: 'GIFT_CART_LIST_WITH_LOGIN in successfully!',
    GIFT_CART_LIST_WITH_LOGIN_FAILED: 'GIFT_CART_LIST_WITH_LOGIN failed!',
}

   

export const giftCartListWithoutLoginRequest = createAction(giftCartListWithoutLoginActions.GIFT_CART_LIST_WITHOUT_LOGIN_REQUEST);
export const giftCartListWithoutLoginStarted = createAction(giftCartListWithoutLoginActions.GIFT_CART_LIST_WITHOUT_LOGIN_START);
export const giftCartListWithoutLoginSuccess = createAction(giftCartListWithoutLoginActions.GIFT_CART_LIST_WITHOUT_LOGIN_SUCCESS);
export const giftCartListWithoutLoginFailed = createAction(giftCartListWithoutLoginActions.GIFT_CART_LIST_WITHOUT_LOGIN_FAILED);

export const giftCartListWithLoginRequest = createAction(giftCartListWithLoginActions.GIFT_CART_LIST_WITH_LOGIN_REQUEST);
export const giftCartListWithLoginStarted = createAction(giftCartListWithLoginActions.GIFT_CART_LIST_WITH_LOGIN_START);
export const giftCartListWithLoginSuccess = createAction(giftCartListWithLoginActions.GIFT_CART_LIST_WITH_LOGIN_SUCCESS);
export const giftCartListWithLoginFailed = createAction(giftCartListWithLoginActions.GIFT_CART_LIST_WITH_LOGIN_FAILED);
