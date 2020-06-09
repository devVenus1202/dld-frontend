import { createLogic } from "redux-logic";
import {
  categoryListActions,
  categoryListStarted,
  categoryListFailed,
  categoryListSuccess
} from "./../actions";
import { ApiHelper } from "../helpers/ApiHelper";

export const categoryListLogic = createLogic({
  type: categoryListActions.CATEGORY_LIST_REQUEST,
  cancelType: categoryListActions.CATEGORY_LIST_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      categoryListStarted({
        categoryList: [],
        isLoading: true
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "category",
      "GET",
      false,
      action.payload,
      undefined
    );
    if (result.isError) {
      dispatch(
        categoryListFailed({
          categoryList: [],
          isLoading: false
        })
      );
      done();
      return;
    } else {
      dispatch(
        categoryListSuccess({
          categoryList: result.data.data,
          isLoading: false
        })
      );
      done();
    }
  }
});
