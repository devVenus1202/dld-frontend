import React, {Component} from "react";
import {AppConfig} from "../../config/AppConfig";
import {ApiHelper} from "../../helpers/ApiHelper";
import {Link} from "react-router-dom";
import WebinarOrderDetails from "../../components/Static/Profile/WebinarOrderDetails";
import {isAuth} from "../../helpers/user";

class ThankYou extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetailsData: []
    };
  }

  async componentWillMount() {
    const orderId = {
      orderId: this.props.match.params.orderId
    };
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/order",
      "/orderDetails",
      "GET",
      false,
      orderId,
      undefined
    );

    const redirectData = {
      pathname: "/",
      state: {
        dataBoolean: true,
        dataMessage: "Product Not Found"
      }
    }

    if (!result.isError) {
      if (result.data.data && result.data.data.product) {
      this.setState({
        orderDetailsData: result.data.data
      });
    } else {
        if(isAuth()){
          redirectData.pathname = '/dashboard'
        }
        this.props.history.push(redirectData);
      }
    } else {
      this.props.history.push(redirectData);
    }
  }

  render() {
    const {
      orderDetailsData,
      detailsTitle,
      isOpen,
      webinarDetails
    } = this.state;

    const isWebinar = orderDetailsData.type === "digital";
    // const isPhysical = orderDetailsData.type === "physical";
    return (
      <section className="payment-success-page margin50">
        {
          isWebinar ?

            <div className="row">
              <div className="thank-page-wrap">
                <div className="thank-page-section">
                  <div className="thank-page-block-up">
                    <div className="thank-page-img">
                      <img
                        className=""
                        src={
                          AppConfig.frontUrl +
                          "/assets/img/icons/thank-page-icon.svg"
                        }
                        alt=""
                      />
                    </div>
                    <h1 className="thank-page-heading">Payment Successful!</h1>
                  </div>

                  <div className="purchase-main-heading ">
                    <div className="purchase-main-detail">Order Details</div>
                    <div className="purchase-transation-id">
                      <b className="marginRight5">Transaction ID:</b>{" "}
                      <span>{orderDetailsData.product.transactionId}</span>
                    </div>
                  </div>
                  <div className=" purchase-wrap">
                    {orderDetailsData &&
                    orderDetailsData.product.orderdetails &&
                    orderDetailsData.product.orderdetails.length
                      ? orderDetailsData.product.orderdetails.map((item, index) => {
                        return (
                          <div className="purchase-block" key={index}>
                            <div className="purchase-img ">
                              <img
                                alt=""
                                src={(item.product.smallImageThumbnail) ? AppConfig.cdn + item.product.smallImageThumbnail : AppConfig.cdn + item.product.productImage}
                              />
                            </div>
                            <div className="purchase-tile">
                              <div className="product-name">
                                {item.product.productName}
                                <span className="pull-right value">
                                  &#36;
                                  {item.product.productPrice}
                                </span>
                              </div>
                              <div className="product-info">
                                <span>
                                  {isWebinar ? "Number of seats" : "Quantity"}:{" "}
                                </span>{" "}
                                {item.quantity}
                              </div>
                              <div className="product-info">
                                <span>Category :</span>{" "}
                                {item.product.category.categoryName}
                              </div>
                              <div className="product-info">
                                <span>Type :</span>{" "}
                                {isWebinar ? "Webinar" : "Product"}
                              </div>
                              {isWebinar ? (
                                <div
                                  className="product-info"
                                  onClick={() => {
                                    this.setState({
                                      isOpen: true,
                                      detailsTitle: item.product.productName,
                                      webinarDetails: item.webinarDetails
                                    });
                                  }}
                                  style={{cursor: "pointer"}}
                                >
                                  <span className="link-text">Click here to view seating details</span>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })
                      : null}

                    <div className="product-amount-tile">
                      {
                        orderDetailsData.product.rewardPointInDollar && orderDetailsData.product.rewardPointInDollar !== 0 ?
                          <p>Reward Point
                            Used: {orderDetailsData.product.rewardPoint ? orderDetailsData.product.rewardPoint : 0}</p>
                          : null
                      }
                      <div className="product-amount-sub-tile">
                        <span className="product-amount-name">Subtotal : </span>{" "}
                        <span className="pull-right value">
                          &#36;{orderDetailsData.total}
                        </span>
                      </div>
                      {isWebinar ? null : orderDetailsData.product.shippingCharge && orderDetailsData.product.shippingCharge > 0 ? (
                        <div className="product-amount-sub-tile">
                          <span className="product-amount-name">Shipping : </span>{" "}
                          <span className="pull-right value">
                            + &#36;{orderDetailsData.product.shippingCharge ? orderDetailsData.product.shippingCharge : 0}
                          </span>
                        </div>
                      ) : null}
                      {
                        orderDetailsData.product.rewardPointInDollar || orderDetailsData.product.rewardPointInDollar !== 0 ?
                          <div className="product-amount-sub-tile">
                                                        <span
                                                          className="product-amount-name">Reward Amount : </span>{" "}
                            <span className="pull-right value">
                              - &#36;{orderDetailsData.product.rewardPointInDollar ? orderDetailsData.product.rewardPointInDollar : 0}
                            </span>
                          </div> :
                          null}

                      {
                        orderDetailsData.product.coupanDiscount || orderDetailsData.product.coupanDiscount !== 0 ?
                          <div className="product-amount-sub-tile">
                            <span className="product-amount-name">Discount : </span>
                            <span className="pull-right value">
                              - &#36;{orderDetailsData.product.coupanDiscount ? orderDetailsData.product.coupanDiscount : 0}
                            </span>
                          </div> :
                          null}

                      {
                        orderDetailsData.product.redeemGiftCardPrice || orderDetailsData.product.redeemGiftCardPrice !== 0 ?
                          <div className="product-amount-sub-tile">
                            <span className="product-amount-name">Gift Card Amount : </span>
                            <span className="pull-right value">
                              - &#36;{orderDetailsData.product.redeemGiftCardPrice ? orderDetailsData.product.redeemGiftCardPrice.toFixed(2) : 0}
                            </span>
                          </div> :
                          null}

                      <div className="product-amount-sub-tile product-total-tile">
                        <span className="product-amount-name">TOTAL : </span>{" "}
                        <span className="pull-right value">
                          &#36;
                          {orderDetailsData.product.totalAmount || 0}

                        </span>
                      </div>
                    </div>
                    <div className="user-sent-info">
                      <div className="user-sent-info-heading">
                        A confirmation email has been sent to
                      </div>
                      <a
                        href={["mailto", orderDetailsData.product.email].join(":")}
                        className="user-sent-info-email"
                      >
                        {orderDetailsData.product.email}
                      </a>
                      <div className="btn-contishop">
                        <Link to="/" className="btn-effect one">
                          Back to home
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            :
            <PhysicalSection orderDetailsData={orderDetailsData}/>
        }
        <WebinarOrderDetails
          isOpen={isOpen}
          isLoading={false}
          title={detailsTitle}
          onHide={() => {
            this.setState({isOpen: false});
          }}
          webinarDetails={webinarDetails}
          orderDetailsData={orderDetailsData}
          type={"physical"}
        />
      </section>
    );

  }
}

class PhysicalSection extends Component {
  render() {
    const {orderDetailsData} = this.props;
    const {product, giftcardorderdetails} = orderDetailsData;

    let totalAmount = 0;
    if (product) {
      totalAmount = product.totalAmount;
    }
    if (giftcardorderdetails) {
      totalAmount = giftcardorderdetails.totalAmount;
    }
    return (
      <div className="row">
        <div className="thank-page-wrap">
          <div className="thank-page-section">
            <div className="thank-page-block-up">
              <div className="thank-page-img">
                <img
                  className=""
                  src={
                    AppConfig.frontUrl +
                    "/assets/img/icons/thank-page-icon.svg"
                  }
                  alt=""
                />
              </div>
              <h1 className="thank-page-heading">Payment Successful!</h1>
            </div>

            <div className="purchase-main-heading ">
              <div className="purchase-main-detail">Order Details</div>
              <div className="purchase-transation-id">
                <b className="marginRight5">Transaction ID:</b>{" "}
                <span>{product ? product.transactionId : giftcardorderdetails ? giftcardorderdetails.transactionId : null}</span>
              </div>
            </div>
            <div className=" purchase-wrap">
              {product &&
              product.orderdetails &&
              product.orderdetails.length
                ? product.orderdetails.map((item, index) => {

                  // totalAmount += product.totalAmount ? product.totalAmount: null;
                  return (
                    <div className="purchase-block" key={index}>
                      <div className="purchase-img ">
                        <img
                          alt=""
                          src={(item.product.smallImageThumbnail) ? AppConfig.cdn + item.product.smallImageThumbnail : '/assets/img/img-dld-placeholder.jpg'}
                        />
                      </div>
                      <div className="purchase-tile">
                        <div className="product-name">
                          {item.product.productName}
                          <span className="pull-right value">
                                                         &#36;
                            {item.product.productPrice}
                                                    </span>
                        </div>
                        <div className="product-info">
                                                    <span>
                                                        {"Quantity"}:{" "}
                                                    </span>{" "}
                          {item.quantity}
                        </div>
                        <div className="product-info">
                          <span>Category :</span>{" "}
                          {item.product.category.categoryName}
                        </div>
                        <div className="product-info">
                          <span>Type :</span>{" "}
                          {"Product"}
                        </div>
                      </div>
                    </div>
                  );
                })
                : null}
              {
                product &&
                product.giftcardorderdetails &&
                product.giftcardorderdetails.length
                  ? product.giftcardorderdetails.map((item, index) => {
                    return (
                      <div className="purchase-block" key={index}>
                        <div className="purchase-img ">
                          <img
                            alt=""
                            src={(item.giftcard.smallImageThumbnail) ? AppConfig.cdn + item.giftcard.smallImageThumbnail : '/assets/img/gift-placeholder.jpg'}
                          />
                        </div>
                        <div className="purchase-tile">
                          <div className="product-name">
                            {item.giftcard.title}
                            <span className="pull-right value">
                                                            &#36;
                              {item.currentPrice.toFixed(2)}
                                                     </span>
                          </div>
                          <div className="product-info">
                                                <span>
                                                {"Quantity"}:{" "}
                                                </span>{" "}
                            {item.quantity}
                          </div>
                          <div className="product-info">
                            <span>Type :</span>{" "}
                            {"Gift Card"}
                          </div>
                        </div>
                      </div>
                    );
                  })
                  : null}

              {product ?
                <div className="product-amount-tile">
                  {
                    product ?
                      product.rewardPointInDollar && product.rewardPointInDollar !== 0 ?
                        <p>Reward Point
                          Used: {product.rewardPoint ? product.rewardPoint : 0}</p>
                        : null
                      : null
                  }
                  <div className="product-amount-sub-tile">
                    <span className="product-amount-name">Subtotal : </span>{" "}
                    <span className="pull-right value">
                                            &#36;{orderDetailsData.total ? orderDetailsData.total : 0}
                                        </span>
                  </div>
                  {product.shippingCharge && product.shippingCharge > 0 ? (
                    <div className="product-amount-sub-tile">
                      <span className="product-amount-name">Shipping : </span>{" "}
                      <span className="pull-right value">
                                                + &#36;{product.shippingCharge ? product.shippingCharge : 0}
                                            </span>
                    </div>
                  ) : null}
                  {product.tax && product.tax > 0 ? (
                    <div className="product-amount-sub-tile">
                      <span className="product-amount-name">Tax : </span>{" "}
                      <span className="pull-right value">
                            + &#36;{product.tax ? product.tax : 0}
                          </span>
                    </div>
                  ) : null}
                  {
                    product.rewardPointInDollar || product.rewardPointInDollar !== 0 ?
                      <div className="product-amount-sub-tile">
                        <span className="product-amount-name">Reward Amount : </span>{" "}
                        <span className="pull-right value">
                          - &#36;{product.rewardPointInDollar ? product.rewardPointInDollar : 0}
                        </span>
                      </div> :
                      null}

                  {
                    product.coupanDiscount || product.coupanDiscount !== 0 ?
                      <div className="product-amount-sub-tile">
                        <span className="product-amount-name">Discount : </span>
                        <span className="pull-right value">
                          - &#36;{product.coupanDiscount ? product.coupanDiscount : 0}
                        </span>
                      </div> :
                      null}

                  {
                    product.redeemGiftCardPrice || product.redeemGiftCardPrice !== 0 ?
                      <div className="product-amount-sub-tile">
                        <span className="product-amount-name">Gift Card Amount : </span>
                        <span className="pull-right value">
                                                  - &#36;{product.redeemGiftCardPrice ? product.redeemGiftCardPrice.toFixed(2) : 0}
                                                </span>
                      </div> :
                      null}

                </div>
                : null}
              <div className="product-amount-tile">
                <div className="product-amount-sub-tile product-total-tile">
                  <span className="product-amount-name">TOTAL : </span>{" "}
                  <span className="pull-right value">
                                        &#36;
                    {totalAmount}

                                    </span>
                </div>
              </div>
              <div className="user-sent-info">
                <div className="user-sent-info-heading nav-off">
                  You will not be able to return to this page once you navigate off it
                </div>


                <div className="user-sent-info-heading">
                  A confirmation email has been sent to
                </div>
                <a
                  href={["mailto", product ? product.email : giftcardorderdetails ? giftcardorderdetails.email : null].join(":")}
                  className="user-sent-info-email"
                >
                  {product ? product.email : giftcardorderdetails ? giftcardorderdetails.email : null}
                </a>
                <div className="btn-contishop">
                  <Link to="/" className="btn-effect one">
                    Back to home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default ThankYou;
