import React, {Component} from "react";
import {Route, Switch, withRouter, Redirect} from "react-router-dom";

import Simple from "../container/Simple/Simple";
import Full from "../container/Full/Full";
import FullWithFooter from "../container/FullWithFooter";
import FullCheckout from "../container/FullCheckout/FullCheckout";
import HeaderGiftCheckout from "../container/HeaderGiftCheckout/HeaderGiftCheckout";
import DashFull from "../container/Dashboard/DashFull";
import HomeTemplate from "../container/HomeTemplate/HomeTemplate";
import Dashboard from "../container/DashboardProfile/Dashboard";
import GiftCard from "../container/GiftCard/GiftCard";
import GiftCardDetailPage from "../container/GiftCardDetailPage/GiftCardDetailPage";
import Unsubscribe from "../container/Unsubscribe/Unsubscribe";
import GiftCardTrackPage from "../container/GiftCardTrackPage/GiftCardTrackPage";
import FirstPage from "../components/Static/FirstPage/";
import ForgotPassword from "../components/Auth/ForgotPassword/";
import ResetPassword from "../components/Auth/ResetPassword/";
import Home from "../components/Static/Home/Home";
import Cart from "../container/Cart/Cart";
import Checkout from "../container/Checkout/Checkout";
import ThankYou from "../container/ThankYou/ThankYou";
import WebinarCheckOut from "../container/WebinarCheckOut/WebinarCheckOut";
import ShopGridView from "../components/Static/Shop/ShopGridView";
import Profile from "../components/Static/Profile/Profile";
import ChangePassword from "../components/Static/Profile/ChangePassword";
import Address from "../components/Static/Profile/Address";
import FaqPage from "../components/Static/FaqPage/FaqPage";
import Order from "../components/Static/Profile/Order";
import Webinars from "../components/Static/Profile/Webinars";
import OrderDetail from "../components/Static/Profile/OrderDetail";
import NotFound from "../components/Static/NotFound/NotFound";
import TermsAndCondition from "../container/TermsAndCondition/TermsAndCondition";
import PrivacyPolicy from "../container/PrivacyPolicy/PrivacyPolicy";
import Catalog from "../container/Catalog";
import CatalogProducts from "../container/CatalogProducts";
import CatalogWebinars from "../container/CatalogWebinars";
import CatalogDetails from "../container/Catalog/CatalogDetails";
import GiftCheckout from "../container/GiftCheckout/GiftCheckout";
import GiftCardThankYou from "../container/ThankYou/GiftCardThankYou";
import MyGiftCards from "../components/Static/Profile/GiftCommon/My-Gift-Cards";
const AppRoute = ({component: Component, layout: Layout, redirect, ...rest}) => {
  if (redirect) {
    return (
      <Route
        render={() => (<Redirect to={redirect}/>)}
      />
    );
  }

  return (
    <Route
      {...rest}
      render={props => (
        <Layout {...props}>
          <Component {...props} />
        </Layout>
      )}
    />
  )
};

class AppRoutes extends Component {
  render() {
    return (
      <Switch>
        <AppRoute exact path="/" layout={Simple} component={FirstPage}/>
        <AppRoute path="/login" redirect="/"/>
        <AppRoute exact path="/signup" redirect="/"/>
        <Redirect from='/pcatalog' to='/products'/>
        <Redirect from='/dcatalog' to='/webinars'/>
        <AppRoute path="/catalog" layout={Full} component={Catalog}/>
        <AppRoute path="/products" layout={Full} component={CatalogProducts}/>
        <AppRoute path="/webinars" layout={Full} component={CatalogWebinars}/>
        <AppRoute
          exact
          path="/forgot-password"
          layout={Simple}
          component={ForgotPassword}
        />
        <AppRoute
          exact
          path="/reset-password"
          layout={Simple}
          component={ResetPassword}
        />
        <AppRoute exact path="/home" layout={HomeTemplate} component={Home}/>

        <AppRoute
          exact
          path="/gridview"
          layout={Full}
          component={ShopGridView}
        />
        <AppRoute
          exact
          path="/dashboard"
          layout={DashFull}
          component={Dashboard}
        />
        <AppRoute exact path="/profile" layout={DashFull} component={Profile}/>
        <AppRoute
          exact
          path="/change-password"
          layout={DashFull}
          component={ChangePassword}
        />
        <AppRoute exact path="/address" layout={DashFull} component={Address}/>
        <AppRoute exact path="/cart" layout={FullWithFooter} component={Cart}/>
        <AppRoute
          exact
          path="/checkout"
          layout={FullWithFooter}
          component={Checkout}
        />
        <AppRoute
          exact
          path="/webinar-checkout"
          layout={FullWithFooter}
          component={WebinarCheckOut}
        />
        <AppRoute exact path="/faq" layout={FullWithFooter} component={FaqPage}/>
        <AppRoute exact path="/orders" layout={DashFull} component={Order}/>
        <AppRoute exact path="/my-webinars" layout={DashFull} component={Webinars}/>

        <AppRoute exact path="/my-gift-cards" layout={DashFull} component={MyGiftCards}/>
        <AppRoute exact path="/track-giftcard-logs" layout={FullWithFooter} component={GiftCardTrackPage}/>
        <AppRoute
          exact
          path="/OrderDetail"
          layout={DashFull}
          component={OrderDetail}
        />
        <AppRoute
          exact
          path="/payment-success/:orderId"
          layout={FullCheckout}
          component={ThankYou}
        />
        <AppRoute
          exact
          path="/privacy-policy"
          layout={FullWithFooter}
          component={PrivacyPolicy}
        />

        <AppRoute
          exact
          path="/terms-and-condition"
          layout={FullWithFooter}
          component={TermsAndCondition}
        />
        <AppRoute
          exact
          path="/gift-card/:giftCardSlug"
          layout={FullWithFooter}
          component={GiftCardDetailPage}
        />
        <AppRoute
          exact
          path="/giftcard-success/:orderId"
          layout={FullCheckout}
          component={GiftCardThankYou}
        />
        <Redirect from='/firearm/:productslug' to='/digital/:productslug'/>
        <AppRoute
          exact
          path="/digital/:productslug"
          layout={FullWithFooter}
          component={CatalogDetails}
        />

        <Redirect from='/outdoors/:productslug' to='/physical/:productslug'/>
        <AppRoute
          exact
          path="/physical/:productslug"
          layout={FullWithFooter}
          component={CatalogDetails}
        />
        <AppRoute
          exact
          path="/gift-cards"
          layout={FullWithFooter}
          component={GiftCard}
        />
        {<AppRoute
          exact
          path="/gift-checkout"
          layout={HeaderGiftCheckout}
          component={GiftCheckout}
        />}

        <AppRoute
          exact
          path="/unsubscribe"
          layout={FullWithFooter}
          component={Unsubscribe}
        />
        <AppRoute path="*" layout={Full} component={NotFound}/>
      </Switch>
    );
  }
}

export default withRouter(AppRoutes);




