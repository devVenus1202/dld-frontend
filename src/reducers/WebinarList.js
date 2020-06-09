import { handleActions } from 'redux-actions';
import {webinarListActions} from "./../actions";

const initialAuthState = {
    commentReportLoading: false,
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

export const webinarListReducer = handleActions((
    {
      [webinarListActions.WEBINAR_LIST_START]: (state, action) => ({
        ...state,
        productList: action.payload.productList,
        isMoreData: action.payload.isMoreData,
        loadingMainData: action.payload.loadingMainData,
        loadingPagination: action.payload.loadingPagination,
        totalProduct: action.payload.totalProduct,
        check: action.payload.check
      }),
      [webinarListActions.WEBINAR_LIST_CLEARED]: (state, action) => {
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
      [webinarListActions.WEBINAR_LIST_SUCCESS]: (state, action) => {

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
      [webinarListActions.WEBINAR_LIST_FAILED]: (state, action) => ({
        ...state,
        productList: [],
        isMoreData: false,
        loadingMainData: false,
        loadingPagination: false,
        totalProduct: 0
      }),
      [webinarListActions.WEBINAR_LIST_FILTERS_SUCCESS]: (state, action) => {
        return {
          ...state,
          filtersData: action.payload.data,
          isLoading: false
        };
      },
      [webinarListActions.WEBINAR_LIST_FILTERS_FAILED]: (state, action) => ({
        ...state,
        filtersData: {
          filters: [],
          categories: []
        },
        isLoading: false
      }),
      [webinarListActions.WEBINAR_LIST_FILTERS_REQUEST]: (state, action) => ({
        ...state,
        isLoading: true
      }),
      [webinarListActions.WEBINAR_LIST_FILTERS_CLEAR]: (state, action) => {
        return {
          ...state,
          isLoading: false,
          filtersData: {
            filters: [],
            categories: []
          },
        }
      },
      [webinarListActions.COMMENT_REPORT_START]: (state, action) => ({
          ...state,
          commentReportLoading: true,
      }),
      [webinarListActions.COMMENT_REPORT_SUCCESS]: (state, action) => ({
          ...state,
          commentReportLoading: false,
      }),
      [webinarListActions.COMMENT_REPORT_FAIL]: (state, action) => ({
          ...state,
          commentReportLoading: false,
      })
  }),
    initialAuthState
);
