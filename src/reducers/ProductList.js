import {createAction, handleActions} from "redux-actions";
import {productListActions} from "./../actions";

const initialAuthState = {
  productList: [],
  suggestions: [],
  isLoading: false,
  isMoreData: false,
  loadingMainData: true,
  loadingPagination: false,
  homePagePopularProductsAndWebinars: [],
  fromState: false,
  totalProduct: 0,
  filtersData: {
    filters: [],
    categories: []
  },
  savedState: {
    leftPage: false,
    lastYScroll: 0
  },
  lastFilters: ''
};

export const productListReducer = handleActions(
  {
    [productListActions.PRODUCTLIST_START]: (state, action) => ({
      ...state,
      productList: action.payload.productList,
      isMoreData: action.payload.isMoreData,
      loadingMainData: action.payload.loadingMainData,
      loadingPagination: action.payload.loadingPagination,
      totalProduct: action.payload.totalProduct,
      check: action.payload.check
    }),
    [productListActions.PRODUCTLIST_CLEARED]: (state, action) => {
      return {
        ...state,
        check: null,
        productList: [],
        isMoreData: false,
        loadingMainData: false,
        loadingPagination: false,
        totalProduct: 0
      };
    },
    [productListActions.PRODUCTLIST_SUCCESS]: (state, action) => {

      let productList = state.productList;

      if (action.payload.productList.length) {
        productList = productList.concat(action.payload.productList);
      }

      return {
        ...state,
        productList,
        isMoreData: action.payload.isMoreData,
        loadingMainData: action.payload.loadingMainData,
        loadingPagination: action.payload.loadingPagination,
        totalProduct: action.payload.totalProduct
      };
    },
    [productListActions.PRODUCTLIST_FAILED]: (state, action) => ({
      ...state,
      productList: [],
      isMoreData: false,
      loadingMainData: false,
      loadingPagination: false,
      totalProduct: 0
    }),
    [productListActions.PRODUCT_LIST_AUTOCOMPLETE_SUCCESS]: (state, action) => {
      return {
        ...state,
        suggestions: action.payload.data,
        isLoading: false
      };
    },

    [productListActions.PRODUCT_LIST_AUTOCOMPLETE_FAILED]: (state, action) => ({
      ...state,
      suggestions: [],
      isLoading: false
    }),
    [productListActions.PRODUCT_SAVE_LAST_FILTERS]: (state, action) => {
      return {
        ...state,
        lastFilters: action.payload
      }
    },
    [productListActions.PRODUCT_LIST_AUTOCOMPLETE_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [productListActions.PRODUCT_LIST_AUTOCOMPLETE_CLEAR]: (state, action) => ({
      ...state,
      isLoading: false,
      suggestions: [],
    }),

    [productListActions.PRODUCT_LIST_FILTERS_SUCCESS]: (state, action) => {
      return {
        ...state,
        filtersData: action.payload.data,
        isLoading: false
      };
    },
    [productListActions.PRODUCT_LIST_FILTERS_FAILED]: (state, action) => ({
      ...state,
      filtersData: {
        filters: [],
        categories: []
      },
      isLoading: false
    }),
    [productListActions.PRODUCT_LIST_FILTERS_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [productListActions.PRODUCT_LIST_FILTERS_CLEAR]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        filtersData: {
          filters: [],
          categories: []
        },
      }
    },
    [productListActions.PRODUCT_ALL_DATA_CLEAR_REQUEST]: (state) => {
      return {
        ...state,
      };
    },
    [productListActions.PRODUCT_ALL_DATA_CLEAR_START]: (state) => {
      return {
        ...state,
      };
    },
    [productListActions.PRODUCT_ALL_DATA_CLEAR_SUCCESS]: (state) => {
      return {
        ...state,
      };
    },

    [productListActions.HOME_PAGE_POPULAR_PRODUCTS_START]: (state, action) => ({
      ...state,
      homePagePopularProducts: [],
    }),
    [productListActions.HOME_PAGE_POPULAR_PRODUCTS_SUCCESS]: (state, action) => ({
      ...state,
      homePagePopularProducts: action.payload
    }),
    [productListActions.HOME_PAGE_POPULAR_WEBINARS_START]: (state, action) => ({
      ...state,
      homePagePopularWebinars: [],
    }),
    [productListActions.HOME_PAGE_POPULAR_WEBINARS_SUCCESS]: (state, action) => ({
      ...state,
      homePagePopularWebinars: action.payload
    }),
    [productListActions.HOME_PAGE_POPULAR_WEBINARS_AND_PRODUCTS_START]: (state, action) => ({
      ...state,
      homePagePopularProductsAndWebinars: [],
    }),
    [productListActions.HOME_PAGE_POPULAR_WEBINARS_AND_PRODUCTS_SUCCESS]: (state, action) => {
      return {
        ...state,
        homePagePopularProductsAndWebinars: action.payload && action.payload.data && action.payload.data.data
      };
    },
    [productListActions.PRODUCT_LIST_SAVE_STATE_SUCCESS]: function (state, action) {
      return {
        ...state,
        savedState: action.payload
      };
    },
    [productListActions.PRODUCT_LIST_SAVE_STATE_START]: function (state, action) {
      return {
        ...state,
        savedState: {}
      };
    },
  },
  initialAuthState
);
