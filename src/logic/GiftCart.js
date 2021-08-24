import { createLogic } from "redux-logic";
import {
  giftCartListWithoutLoginActions,
  giftCartListWithoutLoginStarted,
  giftCartListWithoutLoginFailed,
  giftCartListWithoutLoginSuccess,
  giftCartListWithLoginActions,
  giftCartListWithLoginStarted,
  giftCartListWithLoginFailed,
  giftCartListWithLoginSuccess
} from "./../actions";
import { ToastStore } from "react-toasts";
import { ApiHelper } from "../helpers/ApiHelper";

export const giftCartProductListLogic = createLogic({
  type: giftCartListWithoutLoginActions.GIFT_CART_LIST_WITHOUT_LOGIN_REQUEST,
  cancelType: giftCartListWithoutLoginActions.GIFT_CART_LIST_WITHOUT_LOGIN_FAILED,
  async process({ action, getState }, dispatch, done) {

    let giftCartProductSession = JSON.parse(localStorage.getItem("giftCartProduct"));
    dispatch(
      giftCartListWithoutLoginStarted({
        cartProduct: [],
        subTotal: 0,
        total: 0,
        isLoading: true,
      })
    );

    if (giftCartProductSession) {
      if (giftCartProductSession.product.length) {
        let cartData = giftCartProductSession.product;
        let cartLength = giftCartProductSession.product.length;
        var productArray = [];
        for (let i = 0; i < cartLength; i++) {
          productArray.push(cartData[i].productId + "-" + cartData[i].count);
        }
        productArray.join(",");
        var formatted = productArray.join(",");
        var data = { products: formatted };
        let api = new ApiHelper();
        let result = await api.FetchFromServer(
          "/",
          "giftcard/getGiftCartByProductId",
          "GET",
          false,
          data,
          undefined
        );

        if (result.isError) {
          dispatch(
            giftCartListWithoutLoginFailed({
              cartProduct: [],
              subTotal: 0,
              total: 0,
              isLoading: false,
            })
          );
          done();
          ToastStore.error(result.messages[0]);
          return;
        } else {
          dispatch(
            giftCartListWithoutLoginSuccess({
              cartProduct: result.data.data,
              subTotal: result.data.subTotal,
              total: result.data.total,
              isLoading: false,
            })
          );
          done();
        }
      } else {
        dispatch(
          giftCartListWithoutLoginFailed({
            cartProduct: [],
            subTotal: 0,
            total: 0,
            isLoading: false,
          })
        );
        done();
        return;
      }
    } else {
      dispatch(
        giftCartListWithoutLoginFailed({
          cartProduct: [],
          subTotal: 0,
          total: 0,
          isLoading: false,
        })
      );
      done();
      return;
    }
  }
});

export const giftCartProductListLoginLogic = createLogic({
  type: giftCartListWithLoginActions.GIFT_CART_LIST_WITH_LOGIN_REQUEST,
  cancelType: giftCartListWithLoginActions.GIFT_CART_LIST_WITH_LOGIN_FAILED,
  async process({ action, getState }, dispatch, done) {
    dispatch(
      giftCartListWithLoginStarted({
        cartProduct: [],
        subTotal: 0,
        total: 0,
        isLoading: true,
      })
    );

    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "giftcard/getGiftCart",
      "GET",
      true,
      undefined,
      undefined
    );
    if (result.isError) {
      dispatch(
        giftCartListWithLoginFailed({
          cartProduct: [],
          subTotal: 0,
          total: 0,
          isLoading: false,
        })
      );
      localStorage.removeItem("localStorageVal");
      localStorage.removeItem("giftCartProduct");
      ToastStore.error(result.messages[0]);
      done();
      return;
    } else {
      dispatch(
        giftCartListWithLoginSuccess({
          cartProduct: result.data.data,
          subTotal: result.data.subTotal,
          total: result.data.total,
          isLoading: false,
        })
      );
      done();
    }
  }
});
