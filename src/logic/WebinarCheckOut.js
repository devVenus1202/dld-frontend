import { createLogic } from "redux-logic";
import { webinarCheckOutActions } from "./../actions";

export const webinarCheckOutLogic = createLogic({
  type: webinarCheckOutActions.WEBINAR_CHECKOUT_REQUEST,
  cancelType: webinarCheckOutActions.WEBINAR_CHECKOUT_FAILED,
  async process({ action }, dispatch, done) {
    done();
  }
});
