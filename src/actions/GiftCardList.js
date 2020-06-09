import { createAction } from "redux-actions";

export const giftCardListActions = {
  GIFTCARDLIST_REQUEST: "GIFTCARDList Requested!",
  GIFTCARDLIST_SUCCESS: "GIFTCARDList successfully!",
  GIFTCARDLIST_FAILED: "GIFTCARDList failed!",
  GIFTCARDLIST_START: "GIFTCARDList Started!",
  GIFTCARDLIST_FILTER: "GIFTCARDList Filter Started!"
};

export const giftCardListRequest = createAction(
  giftCardListActions.GIFTCARDLIST_REQUEST
);
export const giftCardListStarted = createAction(
  giftCardListActions.GIFTCARDLIST_START
);
export const giftCardListSuccess = createAction(
  giftCardListActions.GIFTCARDLIST_SUCCESS
);
export const giftCardListFailed = createAction(
  giftCardListActions.GIFTCARDLIST_FAILED
);
export const giftCardListFilterRedirection = createAction(
  giftCardListActions.GIFTCARDLIST_FILTER
);
