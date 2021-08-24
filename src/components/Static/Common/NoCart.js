import React, { Component } from "react";
import Constant from "../../../config/Constant";
class NoCart extends Component {
  render() {
    return (
        <div className="no-product-found">
            <div className="noresult-block">
            <div className="noresult-img no-result-img-block">
                <img
                src={Constant.frontUrl + "/assets/img/empty-cart.png"}
                alt=""
                />
            </div>
            <div className="noresult-content">
                <h4>
                Looks like you have no items in your shopping cart.
                </h4>
                <p>
                <a href="/">Click here</a> to continue shopping.
                </p>
            </div>
            </div>
        </div>
    );
  }
}

export default NoCart;