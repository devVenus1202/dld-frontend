import React, { Component } from "react";
import { Link } from "react-router-dom";
import {AppConfig} from "../../../config/AppConfig";

class ShopGridView extends Component {
  render() {
    const { productListData } = this.props;
    return (
      <div id="" className="a-row list-group list-products-wrap">
        {productListData
          ? productListData.productList.map((item, index) => {
              return (
                <div
                  className="item width-product-list grid-width-item"
                  key={index}
                >
                  <div className="product-item img-shine-effect">
                    <Link
                      to={["", item.catalog, item.productSlug].join("/")}
                      className="product-inner shine-effect-inner clearfix"
                    >
                      <div className="image-block">
                        <div className="list-image">
                          <img alt="" src={(item.productImageThumbnail) ? AppConfig.cdn + item.productImageThumbnail : AppConfig.cdn + item.productImage} />
                        </div>
                      </div>
                      <div className="product-info">
                        <h4 className="product-name product_title">
                          {item.productName}
                        </h4>
                      </div>
                      <div className="product-group-info">
                        <div className="price">
                          <span className="Price-amount">
                            <span>
                              <span className="currencySymbol">$</span>
                              {item.productPrice}
                            </span>
                          </span>
                        </div>
                        <div className="remaing-items">
                          <span>
                            <font>{item.remainingQuantity}</font>{" "}
                            {item.status === "digital" ? "Views" : "Qty"}{" "}
                            Remaining
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    );
  }
}

export default ShopGridView;
