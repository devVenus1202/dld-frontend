import { handleActions } from 'redux-actions';
import { webinarCategoryListActions } from "../actions";

const initialAuthState = {
    webinarCategoryList: [],
};

export const webinarCategoryListReducer = handleActions((
    {
        [webinarCategoryListActions.WEBINAR_CATEGORY_LIST_START]: (state, action) => ({
            ...state,
            webinarCategoryList: action.payload.webinarCategoryList,
        }), 
        [webinarCategoryListActions.WEBINAR_CATEGORY_LIST_SUCCESS]: (state, action) => ({
            ...state,
            webinarCategoryList: action.payload.webinarCategoryList,
        }),
        [webinarCategoryListActions.WEBINAR_CATEGORY_LIST_FAILED]: (state, action) => ({
            ...state,
            webinarCategoryList: action.payload.webinarCategoryList,
        })
    }),
    initialAuthState
);