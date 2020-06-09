import React, { Component } from "react";
import ProductDetailPage from "../../components/Static/ProductDetail/ProductDetailPage";
import ProductDescriptionPage from "../../components/Static/ProductDetail/ProductDescriptionPage";
import localStorageFunction from "./LocalCart";
import { ApiHelper } from "../../helpers/ApiHelper";
import { ToastStore } from "react-toasts";
import { connect } from "react-redux";

import {
  hideHeader
} from "../../actions";
class ProductDetail extends Component {
  componentWillMount() {
    const {setHeaderHide} = this.props;
    setHeaderHide({showHeader:true});
  }
  componentDidMount() {
    let cartProductSession = JSON.parse(localStorage.getItem("cartProduct"));
    if (cartProductSession) {
    } else {
      var prod = { productCount: 0, product: {} };
      localStorage.setItem("cartProduct", JSON.stringify(prod));
    }
  }

  async addToCart(data) {
    const storageSession = JSON.parse(localStorage.getItem("localStorageVal"));
    if (storageSession) {
      let dataValue = {
        productId: data.productId,
        quantity: data.count,
        type: "physical"
      };
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
        "/",
        "userCart",
        "POST",
        true,
        undefined,
        dataValue
      );
      if (result.isError) {
        ToastStore.error(result.messages[0]);
        return;
      } else {
        this.props.history.push("/cart");
      }
    } else {
      data.type = "physical";
      localStorageFunction(data);
      this.props.history.push("/cart");
    }
  }

  onRattingAddFun = () => {
    this.props.onRattingAdd();
  }
  render() {
    const { singleProductData, loginState, profileInfo, openLoginPopup, clearProductList } = this.props;
    return (
      <section className="product-detail-page">
        <div className="container">
          <ProductDetailPage
            productDetails={singleProductData}
            loginState={loginState.isLoggedIn}
            clearProductList={clearProductList}
            addToCart={this.addToCart.bind(this)}
          />
          <ProductDescriptionPage
              productDetails={singleProductData}
              profileInfo={profileInfo}
              onRattingAdd={this.onRattingAddFun}
              openLoginPopup={openLoginPopup}
              isLoggedIn={loginState.isLoggedIn}
          />
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    showHeader: state.webSettingsReducer.showHeader
  };
};
const mapDispatchProps = dispatch => {
  return {
    setHeaderHide: data => {
      dispatch(hideHeader(data));
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchProps
)(ProductDetail);

