import { combineReducers } from 'redux';
import { loginReducer } from "./Login";
import { signUpReducer } from "./SignUp";
import { productListReducer } from "./ProductList";
import { webinarListReducer } from "./WebinarList";
import { webinarCategoryListReducer } from "./WebinarCategoryList";
import { categoryListReducer } from "./CategoryList";
import { singleProductBySlugReducer } from "./SingleProduct";
import { profileInfoReducer } from "./ProfileInfo";
import { cartListWithoutLoginReducer } from "./Cart";
import { webinarCheckOutReducer } from "./WebinarCheckOutReducer";
import { userImageReducer } from "./UserImage";
import { giftCardListReducer } from "./GiftCardList";
import { giftCartReducer } from "./GiftCart";
import { settingsReducer } from "./Settings";
import { webSettingsReducer } from "./WebSetting";
import { routerReducer } from 'react-router-redux';

const AppReducer = combineReducers({
    loginReducer,
    signUpReducer,
    productListReducer,
    webinarListReducer,
    categoryListReducer,
    webinarCategoryListReducer,
    singleProductBySlugReducer,
    profileInfoReducer,
    cartListWithoutLoginReducer,
    webinarCheckOutReducer,
    userImageReducer,
    giftCardListReducer,
    giftCartReducer,
    settingsReducer,
    webSettingsReducer,
    
    routing: routerReducer
});

export default AppReducer;