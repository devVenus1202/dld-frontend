import { handleActions } from 'redux-actions';
import { giftCartListWithoutLoginActions, giftCartListWithLoginActions } from "./../actions";

const initialAuthState = {
    cartProduct: [],
    subTotal: 0,
    total: 0,
    isLoading: false,
};

export const giftCartReducer = handleActions((
    {
        [giftCartListWithoutLoginActions.GIFT_CART_LIST_WITHOUT_LOGIN_START]: (state, action) => ({
            ...state,
            cartProduct: action.payload.cartProduct,
            subTotal:  action.payload.subTotal,
            total:  action.payload.total,
            isLoading: action.payload.isLoading
        }), 
        [giftCartListWithoutLoginActions.GIFT_CART_LIST_WITHOUT_LOGIN_SUCCESS]: (state, action) => ({
            ...state,
            cartProduct: action.payload.cartProduct,
            subTotal:  action.payload.subTotal,
            total:  action.payload.total,
            isLoading: action.payload.isLoading
        }),
        [giftCartListWithoutLoginActions.GIFT_CART_LIST_WITHOUT_LOGIN_FAILED]: (state, action) => ({
            ...state,
            cartProduct: action.payload.cartProduct,
            subTotal:  action.payload.subTotal,
            total:  action.payload.total,
            isLoading: action.payload.isLoading
        }),
        [giftCartListWithLoginActions.GIFT_CART_LIST_WITH_LOGIN_START]: (state, action) => ({
            ...state,
            cartProduct: action.payload.cartProduct,
            subTotal:  action.payload.subTotal,
            total:  action.payload.total,
            isLoading: action.payload.isLoading
        }), 
        [giftCartListWithLoginActions.GIFT_CART_LIST_WITH_LOGIN_SUCCESS]: (state, action) => ({
            ...state,
            cartProduct: action.payload.cartProduct,
            subTotal:  action.payload.subTotal,
            total:  action.payload.total,
            isLoading: action.payload.isLoading
        }), 
    }),
    initialAuthState
);