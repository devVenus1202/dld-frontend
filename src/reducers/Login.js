import { handleActions } from 'redux-actions';
import { loginActions } from "./../actions";

const initialAuthState = {
    isLoggingIn: false,
    isLoggedIn: false,
    token: ''
};

export const loginReducer = handleActions((
    {
        [loginActions.LOGIN_START]: (state, action) => ({
            ...state,
            isLoggingIn: action.payload.isLoggingIn,
            isLoggedIn: action.payload.isLoggedIn,
            token: action.payload.token
        }),
        [loginActions.LOGIN_REQUEST]: (state, action) => ({
            ...state,
            isLoggingIn: action.payload.isLoggingIn,
            isLoggedIn: action.payload.isLoggedIn,
            token: action.payload.token
        }), 
        [loginActions.LOGIN_SUCCESS]: (state, action) => ({
            ...state,
            isLoggingIn: action.payload.isLoggingIn,
            isLoggedIn: action.payload.isLoggedIn,
            token: action.payload.token
        }),
        [loginActions.LOGIN_FAILED]: (state, action) => ({
            ...state,
            isLoggingIn: action.payload.isLoggingIn,
            isLoggedIn: action.payload.isLoggedIn,
            token: action.payload.token
        }),
        [loginActions.LOGOUT_SUCCESS]: (state, action) => ({
            ...state,
            isLoggingIn: action.payload.isLoggingIn,
            isLoggedIn: action.payload.isLoggedIn,
            token: action.payload.token
        })
    }),
    initialAuthState
);