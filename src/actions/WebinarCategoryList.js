import { createAction } from 'redux-actions';

export const webinarCategoryListActions = {
    WEBINAR_CATEGORY_LIST_REQUEST: 'WEBINAR_CATEGORY_LIST Requested!',
    WEBINAR_CATEGORY_LIST_SUCCESS: 'WEBINAR_CATEGORY_LIST in successfully!',
    WEBINAR_CATEGORY_LIST_FAILED: 'WEBINAR_CATEGORY_LIST failed!',
    WEBINAR_CATEGORY_LIST_START: 'WEBINAR_CATEGORY_LIST Started!'
}

export const webinarCategoryListRequest = createAction(webinarCategoryListActions.WEBINAR_CATEGORY_LIST_REQUEST);
export const webinarCategoryListStarted = createAction(webinarCategoryListActions.WEBINAR_CATEGORY_LIST_START);
export const webinarCategoryListSuccess = createAction(webinarCategoryListActions.WEBINAR_CATEGORY_LIST_SUCCESS);
export const webinarCategoryListFailed = createAction(webinarCategoryListActions.WEBINAR_CATEGORY_LIST_FAILED);
