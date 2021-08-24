import { createLogic } from 'redux-logic';
import { profileInfoRequest, signUpActions, signUpStart, signUpFailed, loginSuccess, signUpSuccess, cartListWithoutLoginSuccess } from "./../actions";
import { ApiHelper } from "../helpers/ApiHelper";
import { ToastStore } from 'react-toasts';

export const signUpLogic = createLogic({
    type: signUpActions.SIGN_UP_REQUEST,
    cancelType: signUpActions.SIGN_UP_FAILED,
    async process({ action }, dispatch, done) {
        dispatch(signUpStart({
            isSigningUp: true,
            signUpSuccess: false
        }));
        const {
            payload: _payload,
        } = action;
        const {
            handleAuthClose,
            openWelcomePopup,
            ...payload
        } = _payload;
        let api = new ApiHelper();
        let result = await api.FetchFromServer('/', 'user/signup', 'POST', false, undefined, payload);
        if (result.isError) {
            dispatch(signUpFailed({
                isSigningUp: false,
                signUpSuccess: false
            }));
            ToastStore.error(result.messages[0]);
            done();
            return;
        }
        var localStorage_array = { token: result.data.token, isLoggingIn: true };
        localStorage.setItem('localStorageVal', JSON.stringify(localStorage_array));
        dispatch(signUpSuccess({
            isSigningUp: false,
            signUpSuccess: true
        }));
        dispatch(loginSuccess({
            isLoggingIn: false,
            isLoggedIn: true,
            token: result.data.data.token
        }));
        dispatch(profileInfoRequest());
        handleAuthClose();
        openWelcomePopup();
        let cartProductSession = JSON.parse(localStorage.getItem('cartProduct'));
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
                //productArray.join(',');
                // var formatted = productArray.join(",");
                // var data = { "products": formatted };
                let resultCartAdd = await api.FetchFromServer('/', 'userCart/multiProduct', 'POST', true, undefined, productArray);
                if (resultCartAdd.isError) {
                    localStorage.removeItem("localStorageVal");
                    ToastStore.error(result.messages[0]);
                }
                else {
                    localStorage.removeItem("cartProduct");
                    // localStorage.setItem('loginCartProduct', JSON.stringify(resultCartAdd.data.data));
                    dispatch(cartListWithoutLoginSuccess({
                        cartProduct: resultCartAdd.data.data,
                        subTotal: resultCartAdd.data.subTotal,
                        total: resultCartAdd.data.total,
                        isLoading: false
                    }));

                }
            }
        }
        done();
    }
});
