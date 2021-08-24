import { createLogic } from 'redux-logic';
import { webinarCategoryListActions, webinarCategoryListStarted, webinarCategoryListSuccess, webinarCategoryListFailed } from "./../actions";
import { ApiHelper } from '../helpers/ApiHelper';

export const webinarCategoryListLogic = createLogic({
    type: webinarCategoryListActions.WEBINAR_CATEGORY_LIST_REQUEST,
    cancelType: webinarCategoryListActions.WEBINAR_CATEGORY_LIST_FAILED,
    async process(object, dispatch, done) {
        dispatch(webinarCategoryListStarted({
            webinarCategoryList: []
        })); 
        let api = new ApiHelper();
        let result = await api.FetchFromServer('/', 'category/outdoorCategory', 'GET', false, undefined, undefined);
        if (result.isError) {            
            dispatch(webinarCategoryListFailed({
                webinarCategoryList:[]
            }));
            done();
            return;
        }
        else{  
            dispatch(webinarCategoryListSuccess({
                webinarCategoryList:result.data.data
            }));
            done();
        }    
    }
});




