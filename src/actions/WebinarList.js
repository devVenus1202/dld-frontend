import { createAction } from 'redux-actions';

export const webinarListActions = {
    WEBINAR_LIST_REQUEST: 'WEBINAR_LIST_REQUEST',
    WEBINAR_LIST_SUCCESS: 'WEBINAR_LIST_SUCCESS',
    WEBINAR_LIST_FAILED: 'WEBINAR_LIST_FAILED',
    WEBINAR_LIST_START: 'WEBINAR_LIST_START',
    WEBINAR_LIST_CLEARED: 'WEBINAR_LIST_CLEARED',

    COMMENT_REPORT_REQUEST: 'COMMENT_REPORT_REQUEST',
    COMMENT_REPORT_START: 'COMMENT_REPORT_START',
    COMMENT_REPORT_SUCCESS: 'COMMENT_REPORT_SUCCESS',
    COMMENT_REPORT_FAIL: 'COMMENT_REPORT_FAIL',

    WEBINAR_LIST_FILTERS_REQUEST: 'WEBINAR_LIST_FILTERS_REQUEST',
    WEBINAR_LIST_FILTERS_SUCCESS: 'WEBINAR_LIST_FILTERS_SUCCESS',
    WEBINAR_LIST_FILTERS_FAILED: 'WEBINAR_LIST_FILTERS_FAILED',
    WEBINAR_LIST_FILTERS_START: 'WEBINAR_LIST_FILTERS_START',
    WEBINAR_LIST_FILTERS_CLEAR: 'WEBINAR_LIST_FILTERS_CLEAR'
}

export const webinarListRequest = createAction(webinarListActions.WEBINAR_LIST_REQUEST);
export const webinarListStarted = createAction(webinarListActions.WEBINAR_LIST_START);
export const webinarListSuccess = createAction(webinarListActions.WEBINAR_LIST_SUCCESS);
export const webinarListFailed = createAction(webinarListActions.WEBINAR_LIST_FAILED);
export const webinarListCleared = createAction(webinarListActions.WEBINAR_LIST_CLEARED);

export const webinarListFiltersRequest = createAction(webinarListActions.WEBINAR_LIST_FILTERS_REQUEST);
export const webinarListFiltersStarted = createAction(webinarListActions.WEBINAR_LIST_FILTERS_START);
export const webinarListFiltersSuccess = createAction(webinarListActions.WEBINAR_LIST_FILTERS_SUCCESS);
export const webinarListFiltersFailed = createAction(webinarListActions.WEBINAR_LIST_FILTERS_FAILED);
export const webinarListFiltersCleared = createAction(webinarListActions.WEBINAR_LIST_FILTERS_CLEAR);

export const commentReportRequest = createAction(webinarListActions.COMMENT_REPORT_REQUEST);
export const commentReportStart = createAction(webinarListActions.COMMENT_REPORT_START);
export const commentReportSuccess = createAction(webinarListActions.COMMENT_REPORT_SUCCESS);
export const commentReportFail = createAction(webinarListActions.COMMENT_REPORT_FAIL);
