import {createLogic} from "redux-logic";
import {
  settingsFailed,
  settingsStarted,
  settingsSuccess,
  settingsActions
} from "./../actions";
import {ApiHelper} from "../helpers/ApiHelper";

export const SettingsLogic = createLogic({
  type: settingsActions.SETTINGS_REQUEST,
  cancelType: settingsActions.SETTINGS_FAILED,
  async process({action}, dispatch, done) {

    dispatch(
      settingsStarted({
        data: [],
        isLoading: true
      })
    );

    const api = new ApiHelper();

    let result = await api.FetchFromServer(
      "/",
      "settings",
      "GET",
      false,
      action.payload,
      undefined
    );

    if (result.isError) {
      dispatch(
        settingsFailed({
          data: [],
          isLoading: false
        })
      );
    } else {
      dispatch(
        settingsSuccess({
          data: result.data.data,
          isLoading: false
        })
      );
    }

    done();
  }
});
