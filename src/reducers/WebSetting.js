import {handleActions} from "redux-actions";
import {webSettingsActions} from "./../actions";

const initialAuthState = {
  showHeader: true,
  isLoading: true
};

export const webSettingsReducer = handleActions(
  {
    [webSettingsActions.HEDAER_HIDE]: (state, action) => {
      console.log("handle hader");
      return {
      ...state,
      showHeader: action.payload.showHeader,
    }},
    
  },
  initialAuthState
);
