import { createLogic } from "redux-logic";
import {
    socialActions,
    loginStarted,
    loginFailed,
    loginSuccess,
    cartListWithoutLoginSuccess
} from "./../actions";
import { ApiHelper } from "../helpers/ApiHelper";
import { push } from "react-router-redux";
import { ToastStore } from "react-toasts";

export const fbLoginLogic = createLogic({
    type: socialActions.FB_LOGIN_REQUEST,
    cancelType: socialActions.FB_LOGIN_FAILED,
    async process({ action }, dispatch, done) {
        cartInsertDataFunction(2, function (result) {
            console.log(result)
        });
        return true;
    }
});

export const googleLoginLogic = createLogic({
    type: socialActions.GL_LOGIN_REQUEST,
    cancelType: socialActions.GL_LOGIN_FAILED,
    async process({ action }, dispatch, done) {
        dispatch(
            loginStarted({
                isLoggingIn: true
            })
        );
        const { googleData } = action.payload;
        let data = {
            firstName: googleData.profileObj.givenName,
            lastName: googleData.profileObj.familyName,
            email: googleData.profileObj.email,
            profileImage: googleData.profileObj.imageUrl,
            type: "google"
        }
        let api = new ApiHelper();
        let result = await api.FetchFromServer(
            "/",
            "user/socialLogin",
            "POST",
            false,
            undefined,
            data
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
        }
        else {
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
        }
        let cartProductSession = JSON.parse(localStorage.getItem("cartProduct"));
        cartInsertDataFunction(cartProductSession, async function (productArray) {
            if (productArray) {               
                let resultData = productArray;
                let resultCartAdd = await api.FetchFromServer(
                    "/",
                    "userCart/multiProduct",
                    "POST",
                    true,
                    undefined,
                    resultData
                );
                if (resultCartAdd.isError) {
                    localStorage.removeItem("cartProduct");
                } else {
                    localStorage.removeItem("cartProduct");
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
        });
        ToastStore.success("You have logged in successfully");
        dispatch(
            push(
                action.payload.returnUrl
                    ? decodeURIComponent(action.payload.returnUrl)
                    : "/"
            )
        );
        done();
        return true;
    }
});

async function cartInsertDataFunction(cartProductSession, callback) {
    if (cartProductSession) {
        var productArray = [];
        if (cartProductSession.product.length) {
            let cartData = cartProductSession.product;
            let cartLength = cartProductSession.product.length;

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

        }
        return callback(productArray);
    }
    else {
        return callback(null);
    }

}