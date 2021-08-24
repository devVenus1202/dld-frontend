import { createAction } from 'redux-actions';
export const signUpActions = {
    SIGN_UP_REQUEST: 'SignUp Requested!',
    SIGN_UP_START: 'SignUp Request Started!',
    SIGN_UP_SUCCESS: 'Signed up successfully!',
    SIGN_UP_FAILED: 'SignUp failed!'
}

export const signUpRequest = createAction(signUpActions.SIGN_UP_REQUEST);
export const signUpStart = createAction(signUpActions.SIGN_UP_START);
export const signUpSuccess = createAction(signUpActions.SIGN_UP_SUCCESS);
export const signUpFailed = createAction(signUpActions.SIGN_UP_FAILED);
