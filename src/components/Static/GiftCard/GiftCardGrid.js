import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AppConfig } from "../../../config/AppConfig";

class GiftCardGrid extends Component {
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
                                        to={["gift-card", item.giftcardSlug].join("/")}
                                        className="product-inner shine-effect-inner clearfix"
                                    >
                                        <div className="image-block">
                                            <div className="list-image">
                                                <img alt="..."  src={AppConfig.cdn+item.giftcardThumbnail} />
                                            </div>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name product_title">
                                                {item.title}
                                            </h4>
                                        </div>
                                        <div className="product-group-info">
                                            <div className="price">
                                                <span className="Price-amount">
                                                    <span>
                                                        <span className="currencySymbol">$</span>
                                                        {item.giftcardPrice}
                                                    </span>
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

export default GiftCardGrid;
