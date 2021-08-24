import { createAction } from 'redux-actions';

export const socialActions = {
    FB_LOGIN_REQUEST: 'FB Login Requested!',
    // FB_LOGIN_SUCCESS: 'FB Logged in successfully!',
    // FB_LOGIN_FAILED: 'FB Login failed!',
    // FB_LOGIN_START: 'FB Login Started!',

    GL_LOGIN_REQUEST: 'GL Login Requested!',
    // GL_LOGIN_SUCCESS: 'GL Logged in successfully!',
    // GL_LOGIN_FAILED: 'GL Login failed!',
    // GL_LOGIN_START: 'GL Login Started!',
}

export const fbloginRequest = createAction(socialActions.FB_LOGIN_REQUEST);
// export const fbloginStarted = createAction(socialActions.FB_LOGIN_START);
// export const fbloginSuccess = createAction(socialActions.FB_LOGIN_SUCCESS);
// export const fbloginFailed = createAction(socialActions.FB_LOGIN_FAILED);


export const glloginRequest = createAction(socialActions.GL_LOGIN_REQUEST);
// export const glloginStarted = createAction(socialActions.GL_LOGIN_START);
// export const glloginSuccess = createAction(socialActions.GL_LOGIN_SUCCESS);
// export const glloginFailed = createAction(socialActions.GL_LOGIN_FAILED);
