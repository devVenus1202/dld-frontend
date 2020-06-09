import { createLogic } from 'redux-logic';
import { userImageActions, userImageStart, userImageFailed, userImageSuccess, profileInfoRequest } from "./../actions";
import { ApiHelper } from "../helpers/ApiHelper";
import {ToastStore} from 'react-toasts';

export const userImageLogic = createLogic({
    type: userImageActions.User_Image_REQUEST,
    cancelType: userImageActions.User_Image_FAILED,
    async process({ action }, dispatch, done) {
        let productImage = {
            uploadImage: action.payload
        };
        dispatch(userImageStart({
            isLoading: true,
        }));
        let api = new ApiHelper();
        let result = await api.FetchFromServer('/', 'user/uploadImage', 'POST', true, undefined, productImage);
        if (result.isError) {
            dispatch(userImageFailed({
                isLoading: false,
            }));
            ToastStore.error(result.messages[0]);
            done();
            return;
        }
        dispatch(userImageSuccess({
            isLoading: false,
        })); 
        dispatch(profileInfoRequest());
        done();
    }
});