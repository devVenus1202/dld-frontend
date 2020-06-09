import {createLogic} from "redux-logic";
import {
  productListActions,
  productListStarted,
  productListFailed,
  productListSuccess,
  productListGetFromStateStart,
  productListSaveFromStateStart,
  productListSaveFromStateSuccess, productListCleared, productListFiltersCleared, productListAutoCompleteCleared,
} from "./../actions";
import {ApiHelper} from "../helpers/ApiHelper";
import {
  homePagePopularWebinarsAndProductsStarted,
  homePagePopularWebinarsAndProductsSuccess,
  productAllDataClearFailed,
  productAllDataClearStarted,
  productAllDataClearSuccess, productListAutoCompleteFailed,
  productListAutoCompleteStarted,
  productListAutoCompleteSuccess, productListFiltersFailed,
  productListFiltersStarted,
  productListFiltersSuccess, webinarListCleared, webinarListFiltersCleared
} from "../actions";

export const productLogic = createLogic({
  type: productListActions.PRODUCTLIST_REQUEST,
  cancelType: productListActions.PRODUCTLIST_FAILED,
  async process({action, getState}, dispatch, done) {
    const {
      productList,
      totalProduct
    } = getState().productListReducer;
    const {limit, offset} = action.payload;
    const {check} = action.payload;
    const isFirstRequest = offset === 0;

    dispatch(
      productListStarted({
        productList: productList,
        loadingMainData: true,
        totalProduct: totalProduct,
        check
      })
    );

    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      `product/${action.payload.status}`,
      "GET",
      false,
      action.payload
    );
    if (result.isError) {
      dispatch(
        productListFailed({
          productList: productList,
          loadingMainData: false,
          loadingPagination: false,
          totalProduct: totalProduct,
          isMoreData: false,
          check
        })
      );
      done();
    } else {
      const {data, totalProduct, check} = result.data;
      dispatch(
        productListSuccess({
          productList: isFirstRequest
            ? data && data.result
            : data && data.result,
          isMoreData: data && data.result && data.result.length >= limit,
          loadingMainData: false,
          loadingPagination: false,
          totalProduct: totalProduct,
          check
        })
      );
      done();
    }
  }
});

export const productListAutoCompleteLogic = createLogic({
  type: productListActions.PRODUCT_LIST_AUTOCOMPLETE_REQUEST,
  cancelType: productListActions.PRODUCT_LIST_AUTOCOMPLETE_FAILED,
  async process({action, getState}, dispatch, done) {
    dispatch(productListAutoCompleteStarted());
    const api = new ApiHelper();

    const data = await api.FetchFromServer(
      "/",
      `product/autocomplete/${action.payload.status}`,
      "GET",
      false,
      action.payload
    );

    dispatch(productListAutoCompleteSuccess(data.data));
    done();
  }
});

export const clearAllProductsData = createLogic({
  type: productListActions.PRODUCT_ALL_DATA_CLEAR_REQUEST,
  cancelType: productListActions.PRODUCT_ALL_DATA_CLEAR_FAILED,
  async process({action, getState}, dispatch, done) {
    dispatch(productAllDataClearStarted());
    dispatch(productListCleared());
    dispatch(webinarListCleared());
    dispatch(productListFiltersCleared());
    dispatch(webinarListFiltersCleared());
    dispatch(productListAutoCompleteCleared({}));
    dispatch(productAllDataClearSuccess());
    done();
  }
});

export const productListFiltersLogic = createLogic({
  type: productListActions.PRODUCT_LIST_FILTERS_REQUEST,
  cancelType: productListActions.PRODUCT_LIST_FILTERS_FAILED,
  async process({action, getState}, dispatch, done) {
    dispatch(productListFiltersStarted());
    const api = new ApiHelper();
    const data = await api.FetchFromServer(
      "/",
      `product/filters`,
      "GET",
      false,
      action.payload
    );

    dispatch(productListFiltersSuccess(data.data));
    done();
  }
});



export const homePagePopularWebinarsAndProductsLogic = createLogic({
  type: productListActions.HOME_PAGE_POPULAR_WEBINARS_AND_PRODUCTS_REQUEST,
  cancelType: productListActions.HOME_PAGE_POPULAR_WEBINARS_AND_PRODUCTS_FAILED,
  async process({action, getState}, dispatch, done) {
    dispatch(homePagePopularWebinarsAndProductsStarted());
    const api = new ApiHelper();
    const data = await api.FetchFromServer(
      "/",
      "category/popular-items",
      "GET",
      false,
    );

    dispatch(homePagePopularWebinarsAndProductsSuccess(data));
    done();
  }
});

export const ProductInStateLogic = createLogic({
  type: productListActions.PRODUCT_LIST_FROM_STATE_REQUEST,
  cancelType: productListActions.PRODUCT_LIST_FROM_STATE_FAILED,
  async process({action, getState}, dispatch, done) {
    dispatch(productListGetFromStateStart());
    const {
      productList,
    } = getState().productListReducer;

    dispatch(
      productListSuccess({
        productList,
      })
    );
    done();
  }
});


export const SaveProductStateLogic = createLogic({
  type: productListActions.PRODUCT_LIST_SAVE_STATE_REQUEST,
  cancelType: productListActions.PRODUCT_LIST_SAVE_STATE_FAILED,
  async process({action, getState}, dispatch, done) {
    dispatch(productListSaveFromStateStart());

    dispatch(
      productListSaveFromStateSuccess(action.payload.savedState)
    );

    done();
  }
});
