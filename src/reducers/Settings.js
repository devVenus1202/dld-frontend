import {handleActions} from "redux-actions";
import {settingsActions} from "./../actions";

const initialAuthState = {
  data: [],
  isLoading: true
};

export const settingsReducer = handleActions(
  {
    [settingsActions.SETTINGS_START]: (state, action) => ({
      ...state,
      data: action.payload.data,
      isLoading: action.payload.isLoading,
    }),
    [settingsActions.SETTINGS_SUCCESS]: (state, action) => ({
      ...state,
      data: action.payload.data,
      isLoading: action.payload.isLoading,
    }),
    [settingsActions.SETTINGS_FAILED]: (state, action) => ({
      ...state,
      data: action.payload.data,
      isLoading: action.payload.isLoading,
    })
  },
  initialAuthState
);
