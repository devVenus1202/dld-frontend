import { createAction } from 'redux-actions';

export const profileInfoActions = {
    PROFILE_INFO_REQUEST: 'ProfileInfo Requested!',
    PROFILE_INFO_SUCCESS: 'ProfileInfo successfully!',
    PROFILE_INFO_FAILED: 'ProfileInfo failed!',
    PROFILE_INFO_START: 'ProfileInfo Started!',

    SAVE_PROFILE_SETTINGS_REQUEST: 'SAVE_PROFILE_SETTINGS_REQUEST',
    SAVE_PROFILE_SETTINGS_START: 'SAVE_PROFILE_SETTINGS_START',
    SAVE_PROFILE_SETTINGS_SUCCESS: 'SAVE_PROFILE_SETTINGS_SUCCESS',
    SAVE_PROFILE_SETTINGS_FAILED: 'SAVE_PROFILE_SETTINGS_FAILED',
};

export const profileInfoRequest = createAction(profileInfoActions.PROFILE_INFO_REQUEST);
export const profileInfoStarted = createAction(profileInfoActions.PROFILE_INFO_START);
export const profileInfoSuccess = createAction(profileInfoActions.PROFILE_INFO_SUCCESS);
export const profileInfoFailed = createAction(profileInfoActions.PROFILE_INFO_FAILED);

export const saveProfileSettingsRequest = createAction(profileInfoActions.SAVE_PROFILE_SETTINGS_REQUEST);
export const saveProfileSettingsStart = createAction(profileInfoActions.SAVE_PROFILE_SETTINGS_START);
export const saveProfileSettingsSuccess = createAction(profileInfoActions.SAVE_PROFILE_SETTINGS_SUCCESS);
export const saveProfileSettingsFailed = createAction(profileInfoActions.SAVE_PROFILE_SETTINGS_FAILED);
