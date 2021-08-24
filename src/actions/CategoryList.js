import { createAction } from 'redux-actions';

export const categoryListActions = {
    CATEGORY_LIST_REQUEST: 'CATEGORY_LIST Requested!',
    CATEGORY_LIST_SUCCESS: 'CATEGORY_LIST in successfully!',
    CATEGORY_LIST_FAILED: 'CATEGORY_LIST failed!',
    CATEGORY_LIST_START: 'CATEGORY_LIST Started!',
};

export const categoryListRequest = createAction(categoryListActions.CATEGORY_LIST_REQUEST);
export const categoryListStarted = createAction(categoryListActions.CATEGORY_LIST_START);
export const categoryListSuccess = createAction(categoryListActions.CATEGORY_LIST_SUCCESS);
export const categoryListFailed = createAction(categoryListActions.CATEGORY_LIST_FAILED);
