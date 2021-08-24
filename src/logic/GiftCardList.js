import { createLogic } from "redux-logic";
import {
    giftCardListActions,
    giftCardListStarted,
    giftCardListFailed,
    giftCardListSuccess
} from "./../actions";
import { ApiHelper } from "../helpers/ApiHelper";

export const giftCardListLogic = createLogic({
    type: giftCardListActions.GIFTCARDLIST_REQUEST,
    cancelType: giftCardListActions.GIFTCARDLIST_FAILED,
    async process({ action, getState }, dispatch, done) {
        const {
            productList,
            isMoreData,
            totalProduct
        } = getState().giftCardListReducer;
        const { limit, skip } = action.payload;
        const isFirstRequest = skip === 0;

        dispatch(
            giftCardListStarted({
                productList: productList,
                isMoreData: isMoreData,
                loadingMainData: true,
                loadingPagination: !isFirstRequest,
                totalProduct: totalProduct
            })
        );
        let api = new ApiHelper();
        let result = await api.FetchFromServer(
            "/",
            "giftcard/list",
            "GET",
            false,
            action.payload
        );
        //console.log(result);
        if (result.isError) {
            dispatch(
                giftCardListFailed({
                    productList: productList,
                    loadingMainData: false,
                    loadingPagination: false,
                    totalProduct: totalProduct
                })
            );
            done();
            return;
        } else {
            const { data, totalProduct } = result.data;

            dispatch(
                giftCardListSuccess({
                    productList: isFirstRequest
                        ? data.result
                        : productList.concat(data.result),
                    isMoreData: data.result.length >= limit,
                    loadingMainData: false,
                    loadingPagination: false,
                    totalProduct: totalProduct
                })
            );
            done();
        }
    }
});
