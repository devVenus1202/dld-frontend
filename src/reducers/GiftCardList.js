import { handleActions } from "redux-actions";
import { giftCardListActions } from "./../actions";

const initialAuthState = {
  productList: [],
  isMoreData: false,
  loadingMainData: true,
  loadingPagination: false
};

export const giftCardListReducer = handleActions(
  {
    [giftCardListActions.GIFTCARDLIST_START]: (state, action) => ({
      ...state,
      productList: action.payload.productList,
      isMoreData: action.payload.isMoreData,
      loadingMainData: action.payload.loadingMainData,
      loadingPagination: action.payload.loadingPagination,
      totalProduct: action.payload.totalProduct
    }),
    [giftCardListActions.GIFTCARDLIST_SUCCESS]: (state, action) => ({
      ...state,
      productList: action.payload.productList,
      isMoreData: action.payload.isMoreData,
      loadingMainData: action.payload.loadingMainData,
      loadingPagination: action.payload.loadingPagination,
      totalProduct: action.payload.totalProduct
    }),
    [giftCardListActions.GIFTCARDLIST_FAILED]: (state, action) => ({
      ...state,
      productList: action.payload.productList,
      isMoreData: false,
      loadingMainData: action.payload.loadingMainData,
      loadingPagination: action.payload.loadingPagination,
      totalProduct: action.payload.totalProduct
    })
  },
  initialAuthState
);
