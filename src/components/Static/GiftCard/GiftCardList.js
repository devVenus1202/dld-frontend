import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AppConfig } from "../../../config/AppConfig";

class GiftCardList extends Component {
  render() {
    const { productListData } = this.props;
    return (
      <div id="" className="a-row list-group list-products-wrap">
        {productListData.productList
          ? productListData.productList.map((item, index) => {
              return (
                <div className="item width-product-list  gift-card-item" key={index}>
                  <div className="product-item img-shine-effect">
                    <Link
                      to={["gift-card", item.giftcardSlug].join("/")}
                      className="product-inner shine-effect-inner clearfix"
                    >
                      <div className="image-block">
                        <div className="list-image">
                          <img
                            alt="..."
                            src={AppConfig.cdn+item.giftcardThumbnail}
                            onError={e => {
                              e.target.onError = null;
                              e.target.src =
                                "/assets/img/gift-placeholder.jpg";
                            }}
                          />
                        </div>
                      </div>
                      <div className="product-info">
                        <h4 className="product-name product_title">
                          {item.title}
                        </h4>
                      </div>
                      <div className="product-group-info">
                        <div className="price">
                          <span className="Price-amount"><span>
                            <span className="currencySymbol">$</span>
                            {
                                (item.custom !== 'yes' )
                                    ? item.giftcardPrice
                                    : item.custommin + '-' + item.custommax
                            }</span>
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

export default GiftCardList;
