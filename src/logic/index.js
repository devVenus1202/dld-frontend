import {loginLogic as LoginLogic, logOutLogic as LogOutLogic} from "./Login";
import {signUpLogic as SignUpLogic} from "./Signup";
import {SettingsLogic} from "./Settings";
import {
    productLogic as ProductListLogic,
    homePagePopularWebinarsAndProductsLogic,
    ProductInStateLogic,
    SaveProductStateLogic,
    productListAutoCompleteLogic,
    productListFiltersLogic,
    clearAllProductsData
} from "./ProductList";
import {
    commentReportLogic, webinarListFiltersLogic, webinarListLogic,
} from "./WebinarList";
import {categoryListLogic as CategoryListLogic} from "./CategoryList";
import {webinarCategoryListLogic as WebinarCategoryListLogic} from "./WebinarCategoryList";
import {
    singleProductBySlugLogic as SingleProductBySlugLogic,
    singleGiftProductBySlugLogic as SingleGiftProductBySlugLogic
} from "./SingleProduct";
import {
    profileInfoLogic as ProfileInfoLogic,
    saveProfileSettingsLogic,
} from "./ProfileInfo";
import {
    cartProductListLogic as CartProductListLogic,
    cartProductListLoginLogic as CartProductListLoginLogic
} from "./Cart";
import {loginCartLogic as LoginCartLogic, loginGiftCartLogic as LoginGiftCartLogic} from "./LoginCart";
import {signUpCartLogic as SignUpCartLogic, signUpGiftCartLogic as SignUpGiftCartLogic} from "./SignupCart";
import {webinarCheckOutLogic as WebinarCheckOutLogic} from "./WebinarCheckOut";
import {userImageLogic as UserImageLogic} from "./UserImage";
import {giftCardListLogic as GiftCardListLogic} from "./GiftCardList";
import {
    giftCartProductListLogic as GiftCartProductListLogic,
    giftCartProductListLoginLogic as GiftCartProductListLoginLogic
} from "./GiftCart";
import {fbLoginLogic as FbLoginLogic, googleLoginLogic as GoogleLoginLogic} from "./SocialLogin";
import {createLogic} from "redux-logic";
import {push} from "react-router-redux";

export const redirectToLogic = createLogic({
    type: "REDIRET_TO",
    async process({action}, dispatch, done) {
        dispatch(push(action.payload.path));
        done();
    }
});
export default [
    LoginLogic,
    LogOutLogic,
    SignUpLogic,
    ProductListLogic,
    ProductInStateLogic,
    SaveProductStateLogic,
    commentReportLogic,
    webinarListFiltersLogic,
    webinarListLogic,
    CategoryListLogic,
    WebinarCategoryListLogic,
    SingleProductBySlugLogic,
    clearAllProductsData,
    productListFiltersLogic,
    ProfileInfoLogic,
    CartProductListLogic,
    LoginCartLogic,
    CartProductListLoginLogic,
    SignUpCartLogic,
    WebinarCheckOutLogic,
    UserImageLogic,
    GiftCardListLogic,
    SingleGiftProductBySlugLogic,
    GiftCartProductListLogic,
    GiftCartProductListLoginLogic,
    LoginGiftCartLogic,
    SignUpGiftCartLogic,
    FbLoginLogic,
    GoogleLoginLogic,
    redirectToLogic,
    homePagePopularWebinarsAndProductsLogic,
    saveProfileSettingsLogic,
    productListAutoCompleteLogic,
    SettingsLogic
];
