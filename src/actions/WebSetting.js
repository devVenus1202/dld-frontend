import { createAction } from 'redux-actions';

export const webSettingsActions = {
    HEDAER_HIDE: 'HEDAER_HIDE',
};

export const hideHeader = createAction(webSettingsActions.HEDAER_HIDE);