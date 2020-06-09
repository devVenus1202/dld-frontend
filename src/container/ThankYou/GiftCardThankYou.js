import React, { Component } from "react";
import { AppConfig } from "../../config/AppConfig";
import { ApiHelper } from "../../helpers/ApiHelper";
import { Link } from "react-router-dom";
// import WebinarOrderDetails from "../../components/Static/Profile/WebinarOrderDetails";
class GiftCardThankYou extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetailsData: []
    };
  }

  async componentWillMount() {
    const orderId = {
        giftcardOrderId: this.props.match.params.orderId
    };
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/giftCardOrder",
      "/giftcardOrderList",
      "GET",
      false,
      orderId,
      undefined
    );
    
    if (!result.isError) {
      this.setState({
        orderDetailsData: result.data.data
      });
    } else {
      this.props.history.push({
        pathname: "/",
        state: {
          dataBoolean: true,
          dataMessage: "Product Not Found"
        }
      });
    }
  }
  render() {
    const {
      orderDetailsData,
    } = this.state;
   
  
    return (
      <section className="payment-success-page margin50">
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
                  <span>{orderDetailsData.transactionId}</span>
                </div>
              </div>
              <div className=" purchase-wrap">
                {orderDetailsData &&
                orderDetailsData.giftcardorderdetails &&
                orderDetailsData.giftcardorderdetails.length
                  ? orderDetailsData.giftcardorderdetails.map((item, index) => {
                      return (
                        <div className="purchase-block" key={index}>
                          <div className="purchase-img ">
                            <img
                              alt=""
                              src={AppConfig.cdn + item.giftcard.smallImageThumbnail}
                            />
                          </div>
                          <div className="purchase-tile">
                            <div className="product-name">
                              {item.giftcard.title}
                              <span className="pull-right value">
                                &#36;
                                {item.giftcard.giftcardPrice}
                              </span>
                            </div>
                            <div className="product-info">
                              <span>
                                Quantity
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

                <div className="product-amount-tile">
                 
                  <div className="product-amount-sub-tile">
                    <span className="product-amount-name">Subtotal : </span>{" "}
                    <span className="pull-right value">
                      &#36;{orderDetailsData.grossAmount ? orderDetailsData.grossAmount : 0}
                    </span>
                  </div> 
                  
                  <div className="product-amount-sub-tile product-total-tile">
                    <span className="product-amount-name">TOTAL : </span>{" "}
                    <span className="pull-right value">
                      &#36;
                      {orderDetailsData.totalAmount || 0}
                 
                    </span>
                  </div>
                </div>
                <div className="user-sent-info">
                  <div className="user-sent-info-heading">
                    A confirmation email has been sent to
                  </div>
                  <a
                    href={["mailto", orderDetailsData.email].join(":")}
                    className="user-sent-info-email"
                  >
                    {orderDetailsData.email}
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
      </section>
    );
  }
}

export default GiftCardThankYou;
