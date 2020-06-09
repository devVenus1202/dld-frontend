import {createLogic} from "redux-logic";
import {
    signUpCartActions,
    cartListWithoutLoginSuccess,
    signUpActions,
    signUpStart,
    signUpFailed,
    loginSuccess,
    signUpSuccess,
    giftCartListWithoutLoginSuccess,
    profileInfoRequest
} from "../actions";
import {ApiHelper} from "../helpers/ApiHelper";
import {push} from "react-router-redux";
import {ToastStore} from "react-toasts";

export const signUpCartLogic = createLogic({
    type: signUpCartActions.SIGNUP_CART_REQUEST,
    cancelType: signUpActions.SIGN_UP_FAILED,
    async process({action}, dispatch, done) {
        //console.log("testing");
        dispatch(
            signUpStart({
                isSigningUp: true,
                signUpSuccess: false
            })
        );
        const {
            payload: _payload,
        } = action;
        const {
            handleAuthClose,
            openWelcomePopup,
            ...payload
        } = _payload;
        let api = new ApiHelper();
        let result = await api.FetchFromServer(
            "/",
            "user/signup",
            "POST",
            false,
            undefined,
            payload,
        );
        if (result.isError) {
            dispatch(
                signUpFailed({
                    isSigningUp: false,
                    signUpSuccess: false
                })
            );
            ToastStore.error(result.messages[0]);
            done();
            return;
        }
        var localStorage_array = {token: result.data.token, isLoggingIn: true};
        localStorage.setItem("localStorageVal", JSON.stringify(localStorage_array));
        dispatch(
            signUpSuccess({
                isSigningUp: false,
                signUpSuccess: true
            })
        );
        dispatch(
            loginSuccess({
                isLoggingIn: false,
                isLoggedIn: true,
                token: result.data.data.token
            })
        );
        handleAuthClose();
        openWelcomePopup();
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
                productArray.join(",");
                // var formatted = productArray.join(",");
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
                    localStorage.removeItem("localStorageVal");
                    ToastStore.error(result.messages[0]);
                } else {
                    localStorage.removeItem("cartProduct");

                    // dispatch(
                    //   cartListWithoutLoginSuccess({
                    //     cartProduct: resultCartAdd.data.data,
                    //     subTotal: resultCartAdd.data.subTotal,
                    //     total: resultCartAdd.data.total,
                    //     isLoading: false
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
                        isLoading: false
                    })
                );
                //window.location.reload();
            }
        }
        if (action.payload.asAGuest) {
            dispatch(push("/checkout"));
        }
        dispatch(profileInfoRequest());
        done();
    }
});


export const signUpGiftCartLogic = createLogic({
    type: signUpCartActions.SIGNUP_GIFT_CART_REQUEST,
    cancelType: signUpActions.SIGN_UP_FAILED,
    async process({action}, dispatch, done) {
        dispatch(
            signUpStart({
                isSigningUp: true,
                signUpSuccess: false
            })
        );
        let api = new ApiHelper();
        let result = await api.FetchFromServer(
            "/",
            "user/signup",
            "POST",
            false,
            undefined,
            action.payload
        );
        if (result.isError) {
            dispatch(
                signUpFailed({
                    isSigningUp: false,
                    signUpSuccess: false
                })
            );
            ToastStore.error(result.messages[0]);
            done();
            return;
        }
        var localStorage_array = {token: result.data.token, isLoggingIn: true};
        localStorage.setItem("localStorageVal", JSON.stringify(localStorage_array));
        dispatch(
            signUpSuccess({
                isSigningUp: false,
                signUpSuccess: true
            })
        );
        dispatch(
            loginSuccess({
                isLoggingIn: false,
                isLoggedIn: true,
                token: result.data.data.token
            })
        );
        let cartProductSession = JSON.parse(localStorage.getItem("giftCartProduct"));
        if (cartProductSession) {
            if (cartProductSession.product.length) {
                let cartData = cartProductSession.product;
                let cartLength = cartProductSession.product.length;
                var productArray = [];
                for (let i = 0; i < cartLength; i++) {
                    productArray.push(cartData[i].productId + "-" + cartData[i].count);
                }
                productArray.join(",");
                var formatted = productArray.join(",");
                var data = {products: formatted};
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
                    dispatch(
                        giftCartListWithoutLoginSuccess({
                            cartProduct: resultCartAdd.data.data,
                            subTotal: resultCartAdd.data.subTotal,
                            total: resultCartAdd.data.total,
                            isLoading: false
                        })
                    );
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
                dispatch(
                    giftCartListWithoutLoginSuccess({
                        cartProduct: resultCartAdd.data.data,
                        subTotal: resultCartAdd.data.subTotal,
                        total: resultCartAdd.data.total,
                        isLoading: false
                    })
                );
                //window.location.reload();
            }
        }
        if (action.payload.asAGuest) {
            dispatch(push("/gift-checkout"));
        }
        dispatch(profileInfoRequest());
        done();
    }
});
