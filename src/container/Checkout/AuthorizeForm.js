import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Constant from "../../config/Constant";
import MaskedInput from "react-maskedinput";
import { AppConfig } from "../../config/AppConfig";
import Loader from "../../components/Static/Common/Loader/Loader";
import Timer from "../../components/Static/Common/Timer";

const isDev = process.env.NODE_ENV === 'development'

class AuthorizeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      card: "",
      expiry: "",
      ccv: "",
      nameOnCard: ""
    };
  }

  async componentWillMount() {
    var imported = document.createElement("script");
    imported.src = "https://jstest.authorize.net/v1/Accept.js";
    imported.charset = "utf-8";
    document.head.appendChild(imported);
  }

  _onChange = e => {
    let value = e.target.value
    if (e.target.name === "card" || e.target.name === "ccv") {
      value = value.replace(/ /g, '').replace('.', '').slice(0, 16)
    }
    if (e.target.name === "card" && isNaN(value)) {
      return;
    }
    if (e.target.name === "ccv" && isNaN(value)) {
      return;
    }

    this.setState({ [e.target.name]: value });
  };

  sendPaymentDataToAnet(event) {
    this.setState({ processing: true });
    this.paymentFormUpdate();
  }

  paymentFormUpdate() {
    const { card, expiry, ccv, nameOnCard } = this.state;
    const { cardTotal } = this.props
    let apiData = {}
    if (cardTotal > 0) {
      const cartExpiry = expiry.split("/");
      var cardData = {};
      let cardDataValue = card.trimAllSpace();
      cardData.cardNumber = cardDataValue.replace("_", "").trimAllSpace();
      cardData.month = cartExpiry[0];
      cardData.year = cartExpiry[1];
      cardData.cardCode = ccv;
      cardData.cardName = nameOnCard;
      apiData = {
        cardNumber: cardData.cardNumber,
        expirationMonth: cardData.month,
        expirationYear: cardData.year,
        cvv: cardData.cardCode,
        cardName : cardData.nameOnCard
      }
    } else {
      let date = new Date();
      let Year = date.getFullYear();
      console.log((Year % 2000) + 1);
      apiData = {
        cardNumber: '111111111111111',
        expirationMonth: "12",
        expirationYear: String((Year % 2000) + 1),
        cvv: '111'
      }
    }
    this.props.paymentFunction(apiData);
  }

  handleHide = () => {
    this.props.closeAuthFunction(false);
  };

  handleExit = (e) => {
    if (e) {
      this.props.closeAuthFunction(false);
    }
  };

  render() {
    const { cardTotal } = this.props

    if (cardTotal > 0) {
      return this.ModalNeedPay();
    } else {
      return this.ModalNotNeedPay();
    }

  }

  ModalNeedPay = () => {
    const { availableTo, backBtn = false } = this.props

    return (
      <Modal
        show={this.props.displayAuthModel ? this.props.displayAuthModel : false}
        onHide={this.handleExit}
        className="authorizemodal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">
            Enter your payment information
                        {availableTo && (
              <Timer to={availableTo} onEnd={this.handleHide} />
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="authorize-form">
            {this.props.loaderDisplay ? <Loader /> : null}
            {this.props.errorAuth ? (
              <div className={"cardErrorMsg"}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: this.props.errorMessage
                  }}
                />
              </div>
            ) : null}

            <div className="form-group col-sm-12 CreditCardDetails">
              <div className="stripImg">
                <img
                  src={Constant.frontUrl + "/assets/img/stripe-img.jpg"}
                  alt="stripe-img"
                />
              </div>
              <label htmlFor="Email">Card Number</label>
              <input
                type={"text"}
                name={"card"}
                className={"form-control"}
                id={"card"}
                placeholder={"Ex. 4111111111111111"}
                onChange={this._onChange}
                //maxLength={16}
                value={this.state.card}
              />
            </div>
            <div className="form-group col-sm-12">
              <label htmlFor="nameOnAccount">Name on Card</label>
              <input
                type="text"
                className="form-control"
                id="nameOnAccount"
                name="nameOnCard"
                placeholder="Ex. John"
                onChange={this._onChange}
              />
            </div>
            <div className="clearfix">
              <div className="form-group col-sm-6">
                <label htmlFor="expiry">Expiration</label>
                <MaskedInput
                  mask="11/11"
                  id="expiry"
                  className="form-control"
                  name="expiry"
                  placeholder="mm/yy"
                  onChange={this._onChange}
                />
              </div>
              <div className="form-group col-sm-6">
                <label htmlFor="Email">CVC / CVV Number</label>
                <input
                  type={"text"}
                  name={"ccv"}
                  className={"form-control"}
                  id={"cardCode"}
                  placeholder="Ex. 123"
                  onChange={this._onChange}
                  minLength={3}
                  maxLength={4}
                  value={this.state.ccv}
                />
              </div>
            </div>
            <br />
            <div className="form-group text-center">
              {backBtn && (
                <button
                  className={"btn-effect one"}
                  onClick={this.handleHide}
                >
                  Back
                                 </button>
              )}
              {
                this.props.cardTotal > AppConfig.maxAmount
                  ?
                  <button
                    className="btn-orange one"
                    disabled
                  >
                    Pay{" "}
                    <span className="text-roboto">
                      {AppConfig.currency}
                      {this.props.cardTotal}
                    </span>
                  </button>


                  :
                  <button
                    className="btn-orange one"
                    onClick={this.sendPaymentDataToAnet.bind(this)}
                  >
                    Pay{" "}
                    <span className="text-roboto">
                      {AppConfig.currency}
                      {this.props.cardTotal}
                    </span>
                  </button>
              }

            </div>
            {
              this.props.cardTotal > AppConfig.maxAmount
                ?
                <p className="note">( We accept up to <span
                  className="font-roboto">${AppConfig.maxAmountString}</span> only.)</p>
                : null
            }
            <input type="hidden" name="dataValue" id="dataValue" />
            <input type="hidden" name="dataDescriptor" id="dataDescriptor" />
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  ModalNotNeedPay = () => {
    const { availableTo } = this.props

    return (
      <Modal
        show={this.props.displayAuthModel ? this.props.displayAuthModel : false}
        onHide={this.handleHide}
        className="authorizemodal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">
            Payment Confirmation
                        {availableTo && (
              <Timer to={availableTo} onEnd={this.handleHide} />
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="authorize-form">
            {this.props.loaderDisplay ? <Loader /> : null}

            {this.props.errorAuth ? (
              <div className={"cardErrorMsg"}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: this.props.errorMessage
                  }}
                />
              </div>
            ) : null}

            <div className="form-group col-sm-12 CreditCardDetails">
              <span>
                Your order is fully covered by your gift card. Please approve using your gift card balance to continue checkout.
                            </span>
            </div>
            <div className="form-group text-center">
              {

                <button
                  className="btn-orange one"
                  onClick={this.sendPaymentDataToAnet.bind(this)}
                >
                  <span
                    className="text-roboto">YES, CONFIRM IT</span>
                </button>
              }

            </div>
            <input type="hidden" name="dataValue" id="dataValue" />
            <input type="hidden" name="dataDescriptor" id="dataDescriptor" />
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default AuthorizeForm;
