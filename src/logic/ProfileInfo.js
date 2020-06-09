import {createLogic} from "redux-logic";
import {
    profileInfoActions,
    profileInfoRequest,
    profileInfoStarted,
    profileInfoFailed,
    profileInfoSuccess,
    loginSuccess,
    saveProfileSettingsStart,
    saveProfileSettingsSuccess,
    saveProfileSettingsFailed,
} from "./../actions";
import {ApiHelper} from "../helpers/ApiHelper";
import {push} from "react-router-redux";
import {ToastStore} from "react-toasts";
import { updateToken } from "../helpers/user";

export const profileInfoLogic = createLogic({
    type: profileInfoActions.PROFILE_INFO_REQUEST,
    cancelType: profileInfoActions.PROFILE_INFO_FAILED,
    async process({action}, dispatch, done) {
        dispatch(
            profileInfoStarted({
                profileInfo: []
            })
        );
        let api = new ApiHelper();
        let result = await api.FetchFromServer(
            "/",
            "user/profile",
            "GET",
            true,
            undefined
        );
        console.log(result);
        if (result.isError) {
            dispatch(
                profileInfoFailed({
                    profileInfo: []
                })
            );
            localStorage.removeItem("localStorageVal");
            dispatch(push("/login"));
            done();
            return;
        } else {
            // ToastStore.success("Product Below");
            updateToken({token: result.data.token});

            dispatch(
                profileInfoSuccess({
                    profileInfo: result.data.data
                })
            );

            const storageSession = JSON.parse(
                localStorage.getItem("localStorageVal")
            );
            dispatch(
                loginSuccess({
                    isLoggingIn: false,
                    isLoggedIn: true,
                    token: storageSession.token
                })
            );
            done();
        }
    }
});

export const saveProfileSettingsLogic = createLogic({
    type: profileInfoActions.SAVE_PROFILE_SETTINGS_REQUEST,
    cancelType: profileInfoActions.SAVE_PROFILE_SETTINGS_FAILED,
    async process({action}, dispatch, done) {
        dispatch(saveProfileSettingsStart());

        let api = new ApiHelper();
        let result = await api.FetchFromServer(
            "/",
            "user/profile/settings",
            "POST",
            true,
            undefined,
            action.payload,
        );

        if (result.isError) {
            dispatch(saveProfileSettingsFailed());

            const errorMessage = result.messages[0] || 'Something went wrong';

            ToastStore.error(errorMessage);

            return done();
        } else {
            dispatch(saveProfileSettingsSuccess());
            dispatch(profileInfoRequest());

            ToastStore.success("Profile settings saved successfully");

            done();
        }
    }
});
