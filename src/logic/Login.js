import {createLogic} from "redux-logic";
import {
    cartListWithoutLoginSuccess,
    loginActions,
    loginFailed,
    loginStarted,
    loginSuccess,
    logOutSuccess,
    profileInfoRequest,
} from "./../actions";
import {ApiHelper} from "../helpers/ApiHelper";
import {push} from "react-router-redux";
import {ToastStore} from "react-toasts";

export const loginLogic = createLogic({
    type: loginActions.LOGIN_REQUEST,
    cancelType: loginActions.LOGIN_FAILED,
    async process({action}, dispatch, done) {
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
            var localStorage_array = {token: result.data.token, isLoggingIn: true};
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
            dispatch(profileInfoRequest());
            let cartProductSession = JSON.parse(localStorage.getItem("cartProduct"));
            if (cartProductSession) {
                if (cartProductSession.product.length) {
                    let cartData = cartProductSession.product;
                    let cartLength = cartProductSession.product.length;
                    var productArray = [];
                    for (let i = 0; i < cartLength; i++) {
                        //productArray.push(cartData[i].productId + "-" + cartData[i].count);
                        productArray.push(
                            {
                                "productId": cartData[i].productId,
                                "type": cartData[i].type,
                                "quantity": cartData[i].count,
                                "customAmount": cartData[i].customAmount || null,
                            }
                        );
                    }
                    // productArray.join(",");
                    //  var formatted = productArray.join(",");
                    // var data = { products: formatted };

                    let resultCartAdd = await api.FetchFromServer(
                        "/",
                        "userCart/multiProduct",
                        "POST",
                        true,
                        undefined,
                        productArray
                    );
                    if (resultCartAdd.isError) {
                        //localStorage.removeItem("localStorageVal");
                        localStorage.removeItem("cartProduct");
                        // localStorage.removeItem("loginCartProduct");

                        //ToastStore.error(result.messages[0]);
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
                                isLoading: false
                            })
                        );
    
                    }
                }
            }

            if (action.payload.returnUrl) {
                dispatch(push(decodeURIComponent(action.payload.returnUrl)));
            }

            done();
        }
    }
});

export const logOutLogic = createLogic({
    type: loginActions.LOGOUT_REQUEST,
    async process({action}, dispatch, done) {
        dispatch(
            logOutSuccess({
                isLoggingIn: false,
                isLoggedIn: false,
                token: ""
            })
        );
        localStorage.removeItem("localStorageVal");
        localStorage.removeItem("giftCartProduct");
        localStorage.removeItem("cartProduct");
        dispatch(push("/"));
        done();
    }
});
