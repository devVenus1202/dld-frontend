import { handleActions } from "redux-actions";
import { singleProductBySlugActions, singleGiftProductBySlugActions } from "./../actions";

const initialAuthState = {
  productData: {},  
  avgRating: 0,
  isLoading: true,
  giftProductData: {},
  isGiftLoading: true
};

export const singleProductBySlugReducer = handleActions(
  {
    [singleProductBySlugActions.SINGLE_PRODUCT_BY_SLUG_START]: (
      state,
      action
    ) => ({
      ...state,
      productData: action.payload.productData,
      avgRating: action.payload.avgRating,
      isLoading: action.payload.isLoading,
      totalRatings: action.payload.totalRatings
    }),
    [singleProductBySlugActions.SINGLE_PRODUCT_BY_SLUG_SUCCESS]: (
      state,
      action
    ) => ({
      ...state,
      productData: action.payload.productData,
      avgRating: action.payload.avgRating,
      isLoading: action.payload.isLoading,
      totalRatings: action.payload.totalRatings
    }),
    [singleProductBySlugActions.SINGLE_PRODUCT_BY_SLUG_FAILED]: (
      state,
      action
    ) => ({
      ...state,
      productData: action.payload.productData,
      avgRating: action.payload.avgRating,
      isLoading: action.payload.isLoading,
      totalRatings: action.payload.totalRatings
    }),
    [singleGiftProductBySlugActions.SINGLE_GIFT_PRODUCT_BY_SLUG_START]: (
      state,
      action
    ) => ({
      ...state,
      giftProductData: action.payload.giftProductData,
      isGiftLoading: action.payload.isGiftLoading,
    }),
    [singleGiftProductBySlugActions.SINGLE_GIFT_PRODUCT_BY_SLUG_SUCCESS]: (
      state,
      action
    ) => ({
      ...state,
      giftProductData: action.payload.giftProductData,
      isGiftLoading: action.payload.isGiftLoading,
    }),
    [singleGiftProductBySlugActions.SINGLE_GIFT_PRODUCT_BY_SLUG_FAILED]: (
      state,
      action
    ) => ({
      ...state,
      giftProductData: action.payload.giftProductData,
      isGiftLoading: action.payload.isGiftLoading,
    })
  },
  initialAuthState
);
