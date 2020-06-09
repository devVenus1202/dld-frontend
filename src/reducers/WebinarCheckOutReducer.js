import { handleActions } from 'redux-actions';
import { webinarCheckOutActions } from "./../actions";

const initialAuthState = {
    productId: '',
    quantity: 0,
    webinarDetails: [],
    productDetails: []
};

export const webinarCheckOutReducer = handleActions((
    {
        [webinarCheckOutActions.WEBINAR_CHECKOUT_START]: (state, action) => ({
            ...state,
            productId: action.payload.productId,
            quantity: action.payload.quantity,
            webinarDetails: action.payload.webinarDetails,
            productDetails: action.payload.productDetails
        }), 
        [webinarCheckOutActions.WEBINAR_CHECKOUT_SUCCESS]: (state, action) => ({
            ...state,
            productId: action.payload.productId,
            quantity: action.payload.quantity,
            webinarDetails: action.payload.webinarDetails,
            productDetails: action.payload.productDetails
        })
    }),
    initialAuthState
);