import { createAction } from 'redux-actions';

export const singleProductBySlugActions = {
    SINGLE_PRODUCT_BY_SLUG_REQUEST: 'Product Details Requested!',
    SINGLE_PRODUCT_BY_SLUG_SUCCESS: 'Product Details successfully!',
    SINGLE_PRODUCT_BY_SLUG_FAILED: 'Product Details failed!',
    SINGLE_PRODUCT_BY_SLUG_START: 'Product Details Started!'
}

export const singleGiftProductBySlugActions = {
    SINGLE_GIFT_PRODUCT_BY_SLUG_REQUEST: 'Gift Product Details Requested!',
    SINGLE_GIFT_PRODUCT_BY_SLUG_SUCCESS: 'Gift Product Details successfully!',
    SINGLE_GIFT_PRODUCT_BY_SLUG_FAILED: 'Gift Product Details failed!',
    SINGLE_GIFT_PRODUCT_BY_SLUG_START: 'Gift Product Details Started!'
}

export const singleProductBySlugRequest = createAction(singleProductBySlugActions.SINGLE_PRODUCT_BY_SLUG_REQUEST);
export const singleProductBySlugStarted = createAction(singleProductBySlugActions.SINGLE_PRODUCT_BY_SLUG_START);
export const singleProductBySlugSuccess = createAction(singleProductBySlugActions.SINGLE_PRODUCT_BY_SLUG_SUCCESS);
export const singleProductBySlugFailed = createAction(singleProductBySlugActions.SINGLE_PRODUCT_BY_SLUG_FAILED);


export const singleGiftProductBySlugRequest = createAction(singleGiftProductBySlugActions.SINGLE_GIFT_PRODUCT_BY_SLUG_REQUEST);
export const singleGiftProductBySlugStarted = createAction(singleGiftProductBySlugActions.SINGLE_GIFT_PRODUCT_BY_SLUG_START);
export const singleGiftProductBySlugSuccess = createAction(singleGiftProductBySlugActions.SINGLE_GIFT_PRODUCT_BY_SLUG_SUCCESS);
export const singleGiftProductBySlugFailed = createAction(singleGiftProductBySlugActions.SINGLE_GIFT_PRODUCT_BY_SLUG_FAILED);
