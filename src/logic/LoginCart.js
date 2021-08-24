import { createLogic } from "redux-logic";
import {
  loginCartActions,
  loginActions,
  loginStarted,
  loginFailed,
  loginSuccess,
  cartListWithoutLoginSuccess,
  profileInfoRequest,
  giftCartListWithoutLoginSuccess
} from "./../actions";
import { ApiHelper } from "../helpers/ApiHelper";
import { ToastStore } from "react-toasts";
import { push } from "react-router-redux";
export const loginCartLogic = createLogic({
  type: loginCartActions.LOGIN_CART_REQUEST,
  cancelType: loginActions.LOGIN_FAILED,
  async process({ action }, dispatch, done) {

    let cartProductSession = JSON.parse(localStorage.getItem("cartProduct"));
    dispatch(
      loginStarted({
        isLoggingIn: true
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "user/login",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError) {
      dispatch(
        loginFailed({
          isLoggingIn: false,
          isLoggedIn: false,
          token: ""
        })
      );
      done();
      ToastStore.error(result.messages[0]);
      return;
    } else {
      var localStorage_array = { token: result.data.token, isLoggingIn: true };
      localStorage.setItem(
        "localStorageVal",
        JSON.stringify(localStorage_array)
      );
      dispatch(
        loginSuccess({
          isLoggingIn: false,
          isLoggedIn: true,
          token: result.data.token
        })
      );
      if (cartProductSession) {
        if (cartProductSession.product.length) {
          let cartData = cartProductSession.product;
          let cartLength = cartProductSession.product.length;
          var productArray = [];
          for (let i = 0; i < cartLength; i++) {
           // productArray.push(cartData[i].productId + "-" + cartData[i].count);
            productArray.push(
              {
                "productId": cartData[i].productId,
                "type": cartData[i].type,
                "quantity": cartData[i].count,
                  "customAmount": cartData[i].customAmount || null,
              }
            );
          }
          //productArray.join(",");
          // var formatted = productArray.join(",");
          //var data = { products: formatted };
          let resultCartAdd = await api.FetchFromServer(
            "/",
            "userCart/multiProduct",
            "POST",
            true,
            undefined,
            productArray
          );
          if (resultCartAdd.isError) {
            localStorage.removeItem("localStorageVal");
            ToastStore.error(result.messages[0]);
          } else {
            localStorage.removeItem("cartProduct");

            //console.log(resultCartAdd.data.data);
            // dispatch(
            //   cartListWithLoginSuccess({
            //     cartProduct:resultCartAdd.data.data,
            //     subTotal: resultCartAdd.data.subTotal,
            //     total: resultCartAdd.data.total,
            //     isLoading: false,
            //     shipping:result.data.shipping
            //   })
            // );
            dispatch(push("/checkout"));
          }
        }
      } else {
        let resultCartAdd = await api.FetchFromServer(
          "/",
          "userCart",
          "POST",
          true,
          undefined,
          undefined
        );
        if (resultCartAdd.isError) {
          localStorage.removeItem("localStorageVal");
          ToastStore.error(result.messages[0]);
        } else {
          localStorage.removeItem("cartProduct");
          // localStorage.setItem(
          //   "loginCartProduct",
          //   JSON.stringify(resultCartAdd.data.data)
          // );
          dispatch(
            cartListWithoutLoginSuccess({
              cartProduct: resultCartAdd.data.data,
              subTotal: resultCartAdd.data.subTotal,
              total: resultCartAdd.data.total,
              isLoading: false,
              shipping: result.data.shipping
            })
          );
        }
      }
      if (action.payload.asAGuest) {
        dispatch(push("/checkout"));
      }
      dispatch(profileInfoRequest());
      done();
    }
  }
});


export const loginGiftCartLogic = createLogic({
  type: loginCartActions.LOGIN_GIFT_CART_REQUEST,
  cancelType: loginActions.LOGIN_FAILED,
  async process({ action }, dispatch, done) {
    let giftCartProductSession = JSON.parse(localStorage.getItem("giftCartProduct"));
    dispatch(
      loginStarted({
        isLoggingIn: true
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "user/login",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError) {
      dispatch(
        loginFailed({
          isLoggingIn: false,
          isLoggedIn: false,
          token: ""
        })
      );
      done();
      ToastStore.error(result.messages[0]);
      return;
    } else {
      var localStorage_array = { token: result.data.token, isLoggingIn: true };
      localStorage.setItem(
        "localStorageVal",
        JSON.stringify(localStorage_array)
      );
      dispatch(
        loginSuccess({
          isLoggingIn: false,
          isLoggedIn: true,
          token: result.data.token
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
          let resultCartAdd = await api.FetchFromServer(
            "/",
            "giftcard/addMultiGiftCart",
            "POST",
            true,
            undefined,
            data
          );
          if (resultCartAdd.isError) {
            localStorage.removeItem("localStorageVal");
            ToastStore.error(result.messages[0]);
          } else {
            localStorage.removeItem("giftCartProduct");
            // localStorage.setItem(
            //   "loginCartProduct",
            //   JSON.stringify(resultCartAdd.data.data)
            // );
            dispatch(
              giftCartListWithoutLoginSuccess({
                cartProduct: [],
                subTotal: resultCartAdd.data.subTotal,
                total: resultCartAdd.data.total,
                isLoading: false,
              })
            );
            // window.location.reload();
          }
        }
      } else {
        let resultCartAdd = await api.FetchFromServer(
          "/",
          "giftcard/getGiftCart",
          "POST",
          true,
          undefined,
          undefined
        );
        if (resultCartAdd.isError) {
          localStorage.removeItem("localStorageVal");
          ToastStore.error(result.messages[0]);
        } else {
          localStorage.removeItem("giftCartProduct");
          // localStorage.setItem(
          //   "loginCartProduct",
          //   JSON.stringify(resultCartAdd.data.data)
          // );
          dispatch(
            giftCartListWithoutLoginSuccess({
              cartProduct: resultCartAdd.data.data,
              subTotal: resultCartAdd.data.subTotal,
              total: resultCartAdd.data.total,
              isLoading: false,
            })
          );
        }
      }
      if (action.payload.asAGuest) {
        dispatch(push("/gift-checkout"));
      }
      dispatch(profileInfoRequest());
      done();
    }
  }
});

