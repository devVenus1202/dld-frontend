import {createLogic} from 'redux-logic';
import {
  webinarListActions,
  webinarListStarted,
  webinarListSuccess,
  webinarListFailed,
  webinarListFiltersStarted,
  webinarListFiltersSuccess,
  commentReportFail,
  commentReportSuccess
} from "./../actions";
import {ApiHelper} from '../helpers/ApiHelper';
import {ToastStore} from 'react-toasts';

export const webinarListLogic = createLogic({
  type: webinarListActions.WEBINAR_LIST_REQUEST,
  cancelType: webinarListActions.WEBINAR_LIST_FAILED,

  async process({action, getState}, dispatch, done) {
    const {
      productList,
      totalProduct
    } = getState().webinarListReducer;
    const {limit, offset} = action.payload;
    const {check} = action.payload;
    const isFirstRequest = offset === 0;

    dispatch(webinarListStarted({
        productList: productList,
        loadingMainData: true,
        totalProduct: totalProduct
      })
    );

    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      `product/digital`,
      "GET",
      false,
      action.payload
    );

    if (result.isError) {

      dispatch(
        webinarListFailed({
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
        webinarListSuccess({
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

export const webinarListFiltersLogic = createLogic({
  type: webinarListActions.WEBINAR_LIST_FILTERS_REQUEST,
  cancelType: webinarListActions.WEBINAR_LIST_FILTERS_FAILED,
  async process({action, getState}, dispatch, done) {
    dispatch(webinarListFiltersStarted());

    const api = new ApiHelper();
    const data = await api.FetchFromServer(
      "/",
      `product/filters`,
      "GET",
      false,
      action.payload
    );

    dispatch(webinarListFiltersSuccess(data.data));
    done();
  }
});

export const commentReportLogic = createLogic({
  type: webinarListActions.COMMENT_REPORT_REQUEST,
  cancelType: webinarListActions.COMMENT_REPORT_FAIL,
  async process({action}, dispatch, done) {
    const {
      onSuccess,
      ...payload
    } = action.payload;

    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      '/',
      'comments/report',
      'POST',
      true,
      undefined,
      payload,
    );

    if (result.isError) {
      dispatch(commentReportFail());

      return done();
    } else {
      dispatch(commentReportSuccess());
      ToastStore.success("Comment reported successfully!");
      onSuccess();

      done();
    }
  }
});
