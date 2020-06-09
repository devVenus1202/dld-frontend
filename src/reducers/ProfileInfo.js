import { handleActions } from 'redux-actions';
import { profileInfoActions } from "./../actions";

const initialAuthState = {
    profileInfo: [],
    saveProfileSettingsLoading: false,
};

export const profileInfoReducer = handleActions((
    {
        [profileInfoActions.PROFILE_INFO_START]: (state, action) => ({
            ...state,
            profileInfo: action.payload.profileInfo,
        }),
        [profileInfoActions.PROFILE_INFO_SUCCESS]: (state, action) => ({
            ...state,
            profileInfo: action.payload.profileInfo,
        }),
        [profileInfoActions.PROFILE_INFO_FAILED]: (state, action) => ({
            ...state,
            profileInfo: action.payload.profileInfo,
        }),
        [profileInfoActions.SAVE_PROFILE_SETTINGS_START]: (state, action) => ({
            ...state,
            saveProfileSettingsLoading: true,
        }),
        [profileInfoActions.SAVE_PROFILE_SETTINGS_SUCCESS]: (state, action) => ({
            ...state,
            saveProfileSettingsLoading: false,
        }),
        [profileInfoActions.SAVE_PROFILE_SETTINGS_FAILED]: (state, action) => ({
            ...state,
            saveProfileSettingsLoading: false,
        })
    }),
    initialAuthState
);
