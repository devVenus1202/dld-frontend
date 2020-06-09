import React, {Component} from "react";
// import ReactImageZoom from "react-image-zoom";
import {withRouter} from "react-router";
import {AppConfig} from "../../../config/AppConfig";
import Magnifier from "react-magnifier";

class GiftCardDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1,
            catalog: undefined,
            productSlug: undefined,
            errorClass: "display_none",
            errorMsg: "",
            windowWidthValue: false,
            customAmount: '',
            errorCustomAmount: "display_none",
            errorCustomAmountMsg: '',
            timervalid: null,
        };
    }

    handleAdd(productId, remainingQuantity) {
        let count = this.state.count;
        let countNew = this.state.count + 1;
        if (countNew > remainingQuantity) {
            this.setState({
                errorClass: "errorCart errorQty",
                errorMsg: "Quantity exceed"
            });
            return;
        } else {
            this.setState({
                errorClass: "display_none",
                errorMsg: ""
            });
        }
        if (countNew > 0) {
            this.setState({count: count + 1});
        }
    }

    handleMinus(productId) {
        let count = this.state.count;
        let countNew = this.state.count - 1;
        if (countNew > 0) {
            this.setState({count: count - 1});
        }
        this.setState({
            errorClass: "display_none",
            errorMsg: ""
        });
    }

    addProductToCart(productId) {
        let amount = this.state.customAmount;

        const {giftCardDetails} = this.props
        const {giftProductData} = giftCardDetails

        if (giftProductData.custom === 'yes') {
            if (!amount || amount <= 0) {
                this.setState({
                    errorCustomAmount: "errorCart errorQty",
                    errorCustomAmountMsg: "Field required"
                });

                return;
            }

            if (amount < giftProductData.custommin) {
                this.setState({
                    errorCustomAmount: "errorCart errorQty",
                    errorCustomAmountMsg: "Minimum amount " + giftProductData.custommin
                });

                return;
            }

            if (amount > giftProductData.custommax) {
                this.setState({
                    errorCustomAmount: "errorCart errorQty",
                    errorCustomAmountMsg: "Maximum amount " + giftProductData.custommax
                });

                return;
            }
        }

        var data = {
            productId: productId,
            count: this.state.count,
            customAmount: amount
        };
        this.props.addToCart(data);
    }

    componentDidMount() {
        let winWidth = window.innerWidth;
        if (winWidth < 768) {
            this.setState({
                windowWidthValue: true
            });
        }
    }

    handleCustomAmountTimer = (edit) => {
        this.setState({
            errorCustomAmount: "",
            errorCustomAmountMsg: ""
        });
        if (this.state.timervalid) {
            clearTimeout(this.state.timervalid);
        }

        const newValue = edit.target.value;
        this.setState({
            customAmount: newValue
        })
        this.setState({
            timervalid: setTimeout(() => {
                this.handleCustomAmount(newValue)
            }, 2000)
        });
    }

    handleCustomAmount = (newValue) => {
        const {giftCardDetails} = this.props;
        const {giftProductData} = giftCardDetails;
        if (newValue) {
            if (newValue < giftProductData.custommin) {
                this.setState({
                    errorCustomAmount: "errorCart errorQty",
                    errorCustomAmountMsg: "Minimum amount " + giftProductData.custommin
                });
            } else if (newValue > giftProductData.custommax) {
                this.setState({
                    errorCustomAmount: "errorCart errorQty",
                    errorCustomAmountMsg: "Maximum amount " + giftProductData.custommax
                });
            }
        }
    }

    render() {
        const {customAmount} = this.state;
        const {giftCardDetails} = this.props;
        const {giftProductData} = giftCardDetails;

        return (
            <div>
                <nav className="breadcrumb">
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href="/gift-cards">Gift Cards</a>
                        </li>
                        <li>{giftProductData.title}</li>
                    </ul>
                </nav>
                <div className="row">
                    <div className="col-sm-12 product-detail-content">
                        <div className="product-type product-block">
                            <div className="product-gallery product-gallery-col">
                                <div className="image-holder">
                                    {
                                        giftProductData.giftcardImage
                                        && (
                                            <Magnifier
                                                src={AppConfig.cdn + giftProductData.giftcardImage}
                                                mgShape={'square'}
                                            />
                                        )
                                    }
                                    {
                                        !giftProductData.giftcardImage && !!Object.keys(giftProductData).length && (
                                            <img src="/assets/img/gift-placeholder.jpg" alt=""/>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="product-summary product-summary-col">
                                <h1 className="product-title">{giftProductData.title}</h1>

                                {(giftProductData.custom !== 'yes') ? (
                                    <p className="price">
                                      <span className="Price-amount price-left">
                                        <span><font className="price-currencysymbol">$</font>
                                          {giftProductData.giftcardPrice ?
                                              giftProductData.giftcardPrice : 0}
                                      </span></span>
                                    </p>
                                ) : null}

                                <div className="product-details-short-description">
                                    <p>{giftProductData.shortDescription ? giftProductData.shortDescription.substring(0, 250) : ""}</p>
                                </div>
                                {giftProductData.isActive ? (
                                   <div>
                                      <div className="quantity">
                                          <div className="control">
                                              <span
                                                  className="btn-number qtyminus quantity-minus"
                                                  onClick={this.handleMinus.bind(this, giftProductData.id)}
                                              >
                                                -
                                              </span>
                                                                  <input
                                                                      type="text"
                                                                      data-step="1"
                                                                      data-min="1"
                                                                      data-max=""
                                                                      name="quantity"
                                                                      value={this.state.count}
                                                                      title="Qty"
                                                                      className="input-qty qty"
                                                                      size="4"
                                                                      min="1"
                                                                      max=""
                                                                      readOnly
                                                                  />
                                                                  <span
                                                                      className="btn-number qtyplus quantity-plus"
                                                                      onClick={this.handleAdd.bind(
                                                                          this,
                                                                          giftProductData.id,
                                                                          parseInt(giftProductData.remainingQuantity)
                                                                      )}
                                                                  >
                                                +
                                              </span>
                                          </div>
                                      </div>
                                      {(giftProductData.custom === 'yes')
                                          ? (<div className="custom">
                                              <div className="control">
                                                  <input
                                                      type="number"
                                                      data-min={giftProductData.custommin}
                                                      data-max={giftProductData.custommax}
                                                      name="custom"
                                                      value={customAmount}
                                                      title="custom amount"
                                                      placeholder="Enter your amount"
                                                      className="input-qty qty"
                                                      size="4"
                                                      min={giftProductData.custommin}
                                                      max={giftProductData.custommax}
                                                      onChange={(e) => {
                                                          this.handleCustomAmountTimer(e)
                                                      }}
                                                  />
                                              </div>
                                              <div className={this.state.errorCustomAmount}>
                                                  {this.state.errorCustomAmountMsg}
                                              </div>
                                          </div>)
                                          : null
                                      }

                                      <button
                                          type="submit"
                                          className="add-cart-btn btn-effect one"
                                          onClick={this.addProductToCart.bind(this, giftProductData.id)}
                                      >
                                          Add to cart
                                      </button>

                                </div>
                                ) : (
                                   <div className="productDeactivate">Product is deactivated or removed</div>
                                )}
                                <div className={this.state.errorClass}>
                                    {this.state.errorMsg}
                                </div>

                                <div className="product-meta">
                                    <div className="sku-wrapper">
                                        Type :<span className="sku">Gift-Card </span>
                                    </div>
                                    {(giftProductData.custom === 'yes') ? (
                                        <div className="sku-wrapper">
                                            Amount (min-max): <span
                                            className="sku">$ {giftProductData.custommin}-{giftProductData.custommax}</span>

                                        </div>

                                    ) : null
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(GiftCardDetail);
