import { createAction } from 'redux-actions';

export const settingsActions = {
    SETTINGS_REQUEST: 'SETTINGS_REQUEST',
    SETTINGS_SUCCESS: 'SETTINGS_SUCCESS',
    SETTINGS_FAILED: 'SETTINGS_FAILED',
    SETTINGS_START: 'SETTINGS_START',
};

export const settingsRequest = createAction(settingsActions.SETTINGS_REQUEST);
export const settingsStarted = createAction(settingsActions.SETTINGS_START);
export const settingsSuccess = createAction(settingsActions.SETTINGS_SUCCESS);
export const settingsFailed = createAction(settingsActions.SETTINGS_FAILED);
