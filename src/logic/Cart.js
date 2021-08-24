import {createLogic} from "redux-logic";
import {
    cartListWithLoginActions, cartListWithLoginFailed, cartListWithLoginStarted, cartListWithLoginSuccess,
    cartListWithoutLoginActions, cartListWithoutLoginFailed, cartListWithoutLoginStarted, cartListWithoutLoginSuccess
} from "./../actions";
import {ToastStore} from "react-toasts";
import {ApiHelper} from "../helpers/ApiHelper";

export const cartProductListLogic = createLogic({
    type: cartListWithoutLoginActions.CART_LIST_WITHOUT_LOGIN_REQUEST,
    cancelType: cartListWithoutLoginActions.CART_LIST_WITHOUT_LOGIN_FAILED,
    async process({action, getState}, dispatch, done) {
        
        let cartProductSession = JSON.parse(localStorage.getItem("cartProduct"));
        dispatch(
            cartListWithoutLoginStarted({
                cartProduct: [],
                subTotal: 0,
                total: 0,
                isLoading: true,
                shipping: 0
            })
        );
        
        if (cartProductSession) {
            if (cartProductSession.product.length) {
                let cartData = cartProductSession.product;
                let cartLength = cartProductSession.product.length;
                var productArray = [];
                for (let i = 0; i < cartLength; i++) {
                    productArray.push(
                        {
                            "productId": cartData[i].productId,
                            "type": cartData[i].type,
                            "quantity": cartData[i].count,
                            "customAmount": cartData[i].customAmount || null,
                        }
                    );
                    //productArray.push(cartData[i].productId + "-" + cartData[i].count);
                }
                //productArray.join(",");
                // var formatted = productArray.join(",");
                // var data = { products: formatted };
                let api = new ApiHelper();
                let result = await api.FetchFromServer(
                    "/",
                    "product/get",
                    "POST",
                    false,
                    undefined,
                    productArray
                );
                
                if (result.isError) {
                    dispatch(
                        cartListWithoutLoginFailed({
                            cartProduct: [],
                            subTotal: 0,
                            total: 0,
                            isLoading: false,
                            shipping: 0
                        })
                    );
                    done();
                    ToastStore.error(result.messages[0]);
                    return;
                } else {
                    // console.log(result);
                    dispatch(
                        cartListWithoutLoginSuccess({
                            cartProduct: result.data.data,
                            subTotal: result.data.subTotal,
                            total: result.data.total,
                            isLoading: false,
                            shipping: result.data.shipping
                        })
                    );
                    done();
                }
            } else {
                dispatch(
                    cartListWithoutLoginFailed({
                        cartProduct: [],
                        subTotal: 0,
                        total: 0,
                        isLoading: false,
                        shipping: 0
                    })
                );
                done();
                return;
            }
        } else {
            dispatch(
                cartListWithoutLoginFailed({
                    cartProduct: [],
                    subTotal: 0,
                    total: 0,
                    isLoading: false,
                    shipping: 0
                })
            );
            done();
            return;
        }
    }
});

export const cartProductListLoginLogic = createLogic({
    type: cartListWithLoginActions.CART_LIST_WITH_LOGIN_REQUEST,
    cancelType: cartListWithLoginActions.CART_LIST_WITH_LOGIN_FAILED,
    async process({action, getState}, dispatch, done) {
        dispatch(
            cartListWithLoginStarted({
                cartProduct: [],
                subTotal: 0,
                total: 0,
                isLoading: true,
                shipping: 0
            })
        );
        
        let api = new ApiHelper();
        let result = await api.FetchFromServer(
            "/",
            "userCart",
            "GET",
            true,
            undefined,
            undefined
        );
        if (result.isError) {
            dispatch(
                cartListWithLoginFailed({
                    cartProduct: [],
                    subTotal: 0,
                    total: 0,
                    isLoading: false,
                    shipping: 0
                })
            );
            localStorage.removeItem("localStorageVal");
            localStorage.removeItem("cartProduct");
            ToastStore.error(result.messages[0]);
            done();
            return;
        } else {
            let cartData = result.data.data;
            let cartLength = result.data.data.length;
            var productArray = [];
            for (let i = 0; i < cartLength; i++) {
                productArray.push(cartData[i].id + "-" + cartData[i].quantity);
            }
            productArray.join(",");
            var formatted = productArray.join(",");
            var dataarray = {products: formatted};
            var loginCartItemForCheckout = dataarray;
            localStorage.setItem(
                "loginCartItemForCheckout",
                JSON.stringify(loginCartItemForCheckout)
            );
            
            dispatch(
                cartListWithLoginSuccess({
                    cartProduct: result.data.data,
                    subTotal: result.data.subTotal,
                    total: result.data.total,
                    isLoading: false,
                    shipping: result.data.shipping
                })
            );
            done();
        }
    }
});
