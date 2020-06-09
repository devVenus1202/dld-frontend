import { createAction } from 'redux-actions';

export const webinarCheckOutActions = {
    WEBINAR_CHECKOUT_REQUEST: 'Webinar Checkout Requested!',
    WEBINAR_CHECKOUT_SUCCESS: 'Webinar Checkout successfully!',
    WEBINAR_CHECKOUT_FAILED: 'Webinar Checkout failed!',
    WEBINAR_CHECKOUT_START: 'Webinar Checkout Started!'
}

export const webinarCheckOutInfoRequest = createAction(webinarCheckOutActions.WEBINAR_CHECKOUT_REQUEST);
export const webinarCheckOutInfoStarted = createAction(webinarCheckOutActions.WEBINAR_CHECKOUT_START);
export const webinarCheckOutInfoSuccess = createAction(webinarCheckOutActions.WEBINAR_CHECKOUT_SUCCESS);
export const webinarCheckOutInfoFailed = createAction(webinarCheckOutActions.WEBINAR_CHECKOUT_FAILED);
