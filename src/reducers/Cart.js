import { handleActions } from 'redux-actions';
import { cartListWithoutLoginActions, cartListWithLoginActions } from "./../actions";

const initialAuthState = {
    cartProduct: [],
    subTotal: 0,
    total: 0,
    isLoading: false,
    shipping: 0
};

export const cartListWithoutLoginReducer = handleActions((
    {
        [cartListWithoutLoginActions.CART_LIST_WITHOUT_LOGIN_START]: (state, action) => ({
            ...state,
            cartProduct: action.payload.cartProduct,
            subTotal: action.payload.subTotal,
            total: action.payload.total,
            isLoading: action.payload.isLoading,
            shipping: action.payload.shipping
        }),
        [cartListWithoutLoginActions.CART_LIST_WITHOUT_LOGIN_SUCCESS]: (state, action) => ({
            ...state,
            cartProduct: action.payload.cartProduct,
            subTotal: action.payload.subTotal,
            total: action.payload.total,
            isLoading: action.payload.isLoading,
            shipping: action.payload.shipping
        }),
        [cartListWithoutLoginActions.CART_LIST_WITHOUT_LOGIN_FAILED]: (state, action) => ({
            ...state,
            cartProduct: action.payload.cartProduct,
            subTotal: action.payload.subTotal,
            total: action.payload.total,
            isLoading: action.payload.isLoading,
            shipping: action.payload.shipping
        }),
        [cartListWithLoginActions.CART_LIST_WITH_LOGIN_START]: (state, action) => ({
            ...state,
            cartProduct: action.payload.cartProduct,
            subTotal: action.payload.subTotal,
            total: action.payload.total,
            isLoading: action.payload.isLoading,
            shipping: action.payload.shipping
        }),
        [cartListWithLoginActions.CART_LIST_WITH_LOGIN_SUCCESS]: (state, action) => ({
            ...state,
            cartProduct: action.payload.cartProduct,
            subTotal: action.payload.subTotal,
            total: action.payload.total,
            isLoading: action.payload.isLoading,
            shipping: action.payload.shipping
        }),
    }),
    initialAuthState
);