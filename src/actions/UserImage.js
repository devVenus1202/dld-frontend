import {
    createAction
} from 'redux-actions';
export const userImageActions = {
    User_Image_REQUEST: 'UserImage Requested!',
    User_Image_START: 'UserImage Request Started!',
    User_Image_SUCCESS: 'UserImage successfully!',
    User_Image_FAILED: 'UserImage failed!'
}

export const userImageRequest = createAction(userImageActions.User_Image_REQUEST);
export const userImageStart = createAction(userImageActions.User_Image_START);
export const userImageSuccess = createAction(userImageActions.User_Image_SUCCESS);
export const userImageFailed = createAction(userImageActions.User_Image_FAILED);
