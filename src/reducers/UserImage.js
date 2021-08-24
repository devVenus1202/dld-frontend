import { handleActions } from 'redux-actions';
import { userImageActions } from "./../actions";

const initialAuthState = {
    isLoading: false,
};

export const userImageReducer = handleActions(({       
        [userImageActions.User_Image_START]: (state, action) => ({
            ...state,
            isLoading: action.payload.isLoading,
        }),
        [userImageActions.User_Image_SUCCESS]: (state, action) => ({
            ...state,
            isLoading: action.payload.isLoading,
        }),
        [userImageActions.User_Image_FAILED]: (state, action) => ({
            ...state,
            isLoading: action.payload.isLoading,
        })        
    }),
    initialAuthState
);