import { handleActions } from "redux-actions";
import { categoryListActions } from "./../actions";

const initialAuthState = {
  categoryList: [],
  isLoading: true
};

export const categoryListReducer = handleActions(
  {
    [categoryListActions.CATEGORY_LIST_START]: (state, action) => ({
      ...state,
      categoryList: action.payload.categoryList,
      isLoading: action.payload.isLoading
    }),
    [categoryListActions.CATEGORY_LIST_SUCCESS]: (state, action) => ({
      ...state,
      categoryList: action.payload.categoryList,
      isLoading: action.payload.isLoading
    }),
    [categoryListActions.CATEGORY_LIST_FAILED]: (state, action) => ({
      ...state,
      categoryList: [],
      isLoading: false
    })
  },
  initialAuthState
);
