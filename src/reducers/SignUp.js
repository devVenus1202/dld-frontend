import { handleActions } from 'redux-actions';
import { signUpActions } from "./../actions";

const initialAuthState = { 
    isSigningUp: false,
    signUpSuccess: false
};

export const signUpReducer = handleActions((
    {
        [signUpActions.SIGN_UP_REQUEST]: (state, action) => ({
            ...state,
            isSigningUp: action.payload.isSigningUp,
            signUpSuccess: action.payload.signUpSuccess
        }),
        [signUpActions.SIGN_UP_SUCCESS]: (state, action) => ({
            ...state,
            isSigningUp: action.payload.isSigningUp,
            signUpSuccess: action.payload.signUpSuccess
        }),
        [signUpActions.SIGN_UP_FAILED]: (state, action) => ({
            ...state,
            isSigningUp: action.payload.isSigningUp,
            signUpSuccess: action.payload.signUpSuccess
        }),
        [signUpActions.SIGN_UP_START]: (state, action) => ({
            ...state,
            isSigningUp: action.payload.isSigningUp,
            signUpSuccess: action.payload.signUpSuccess
        })
    }),
    initialAuthState
);