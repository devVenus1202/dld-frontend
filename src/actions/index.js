import { createAction } from "redux-actions";

export * from "./Login";
export * from "./SignUp";
export * from "./ProductList";
export * from "./WebinarList";
export * from "./CategoryList";
export * from "./WebinarCategoryList";
export * from "./SingleProduct";
export * from "./ProfileInfo";
export * from "./Cart";
export * from "./LoginCart";
export * from "./SignUpCart";
export * from "./WebinarChecOut";
export * from "./UserImage";
export * from "./GiftCardList";
export * from "./GiftCart";
export * from "./SocialLogin";
export * from "./Settings";
export * from "./WebSetting"
export const redirectTo = createAction("REDIRET_TO");
