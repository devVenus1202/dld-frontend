import { createLogic } from "redux-logic";
import { push } from "react-router-redux";
import {
  singleProductBySlugActions,
  singleProductBySlugStarted,
  singleProductBySlugFailed,
  singleProductBySlugSuccess,
  singleGiftProductBySlugActions,
  singleGiftProductBySlugStarted,
  singleGiftProductBySlugFailed,
  singleGiftProductBySlugSuccess
} from "./../actions";
import { ApiHelper } from "../helpers/ApiHelper";

export const singleProductBySlugLogic = createLogic({
  type: singleProductBySlugActions.SINGLE_PRODUCT_BY_SLUG_REQUEST,
  cancelType: singleProductBySlugActions.SINGLE_PRODUCT_BY_SLUG_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      singleProductBySlugStarted({
        productData: {},
        avgRating: 0,
        isLoading: true
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "product/details",
      "POST",
      false,
      undefined,
      { productSlug: action.payload }
    );
    if (result.isError) {
      if(result.code === 400)
      {
        dispatch(push("/404"));
      }
      dispatch(
        singleProductBySlugFailed({
          productData: {},
          avgRating: 0,
          isLoading: false
        })
      );
      done();
      return;
    } else {
      dispatch(
        singleProductBySlugSuccess({
          productData: result.data.data,
          avgRating: result.data.avgRating,
          isLoading: false,
          totalRatings: result.data.totalReviews
        })
      );
      done();
    }
  }
});


export const singleGiftProductBySlugLogic = createLogic({
  type: singleGiftProductBySlugActions.SINGLE_GIFT_PRODUCT_BY_SLUG_REQUEST,
  cancelType: singleGiftProductBySlugActions.SINGLE_GIFT_PRODUCT_BY_SLUG_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      singleGiftProductBySlugStarted({
        giftProductData: {},
        isGiftLoading: true
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "giftcard/productDetail",
      "POST",
      false,
      undefined,
      { productSlug: action.payload }
    );
    if (result.isError) {
      if(result.code === 400)
      {
        dispatch(push("/404"));
      }
      dispatch(
        singleGiftProductBySlugFailed({
          giftProductData: {},
          isGiftLoading: false
        })
      );
      done();
      return;
    } else {
      dispatch(
        singleGiftProductBySlugSuccess({
          giftProductData: result.data.data,
          isGiftLoading: false,
        })
      );
      done();
    }
  }
});