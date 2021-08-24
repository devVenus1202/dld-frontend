import React, {Component} from 'react';
import {Accordion, AccordionItem, AccordionItemBody, AccordionItemTitle,} from 'react-accessible-accordion';
import {ApiHelper} from "../../helpers/ApiHelper";
import deleteStorageFunction from "../Cart/DeleteCart";

class CheckoutCartWithLogin extends Component {

  async removefromCart(productId, count,) {
    const data = {productId: productId, count: count, type: "physical"};

    const storageSession = JSON.parse(localStorage.getItem("localStorageVal"));

    if (storageSession) {
      let api = new ApiHelper();
      let dataValue = {productId: data.productId, type: data.type};
      let result = await api.FetchFromServer(
        "/",
        "userCart/delete",
        "DELETE",
        true,
        dataValue,
        undefined
      );
      window.location.reload();
    } else {
      deleteStorageFunction(data);
      window.location.reload();
    }
  }

  render() {
    const cartDataState = this.props.cartDataState;
    const {disableHandler, addeMailSeats, userEmail, rsrResult} = this.props;

    return (
      <div>
        {cartDataState.cartProduct.map((item, index) => {

          let RSRdata = [];
          let RSRErorrMessage = '';

          if (item.type === "giftcard") {
            return <CheckoutCartGiftLogin
              key={index}
              item={item}
              index={index}
              disableHandler={disableHandler}
              addeMailSeats={addeMailSeats}
              userEmail={userEmail}
            />;
          } else {

            if (item.product.productsphysicaldetail && item.product.productsphysicaldetail.data) {
              RSRdata = item.product.productsphysicaldetail.data;
              const code = RSRdata['RSR Stock Number'] || RSRdata['SKU'];
              if (rsrResult.hasOwnProperty(code)) {
                const rsrResultItem = rsrResult[code];
                if (rsrResultItem.StatusCode === '00') {
                  if (+rsrResultItem.OnHand < +item.quantity) {
                    RSRErorrMessage = `Product is not available for selected quantity. In store: ${rsrResultItem.OnHand}`;
                  }
                } else {
                  RSRErorrMessage = rsrResultItem.StatusMssg === 'Item is blocked'
                    ? 'This item is blocked for shipping to your address'
                    : Boolean(~rsrResultItem.StatusMssg.indexOf('FFLErrCode')) ? rsrResultItem.FFLErrMssg : rsrResultItem.StatusMssg;
                }

              }
            }

            return <div className="shopbilling-cart-block" key={index}>
              <div className="left-block">
                <i className="fa fa-angle-right" aria-hidden="true"></i>
                <div className="pro-view-tile">
                  <h4>{item && item.product && item.product.productName}</h4>
                </div>
                <div className="pro-view-detial">
                  <div className="categ">Quantity : <span>{item.quantity}</span></div>
                  <div className="categ">Type :
                    <span> Physical</span>
                  </div>
                  {
                    (item && item.product && item.product.category) ?
                      <div className="categ">Categories :
                        <span> {item && item.product && item.product.category && item.product.category.categoryName}</span>
                      </div>
                      : null}

                </div>
                {
                  (RSRErorrMessage) ? (
                      <table className="rsrErrorTable">
                        <tr>
                          <td> {RSRErorrMessage} </td>
                          <td><span className="remove-link cursor-point"
                                    onClick={this.removefromCart.bind(this, item.product.id, item.product.quantity)}><i
                            className="fa fa-trash" aria-hidden="true"></i> Remove</span></td>
                        </tr>
                      </table>
                    )
                    : null
                }

              </div>
              <div className="right-block">
                <div className="bill-price">
                                    < span> ${
                                      (item && item.product && item.product.productPrice) ? item.product.productPrice : null
                                    } </span>
                </div>
              </div>
            </div>;
          }
        })
        }
      </div>
    );
  }
}

class CheckoutCartGiftLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setsEmail: [],
      firstRun: false,
      timervalid: null,
      defaultEmail: {},
    };
  }

  validEmailSeats(classes, e, key) {

    this.state.defaultEmail[key] = e.target.value || '';

    if (this.state.timervalid) {
      clearTimeout(this.state.timervalid);
    }

    this.setState({
      timervalid: setTimeout(() => {
        this.handleOnChange(classes);
      }, 2000)
    });
  }

  handleOnChange = (classes) => {
    const {disableHandler, addeMailSeats} = this.props;
    const emailSeats = document.getElementsByClassName(classes);
    let setsEmail = [];
    let index = 0;
    let error = false;
    disableHandler(false);


    if (emailSeats.length > 0) {
      for (let i = 0; i < emailSeats.length; i++) {
        let emailInput = emailSeats[i];
        let value = emailInput.value;
        let item = emailInput.dataset.item;
        if (!setsEmail.hasOwnProperty(item)) {
          index = 0;
          setsEmail = {
            ...setsEmail, ...{

              [item]: {
                [index]: {
                  value: null,
                  valid: true
                }

              }
            }
          };
        } else {
          index++;
          setsEmail[item][index] = {
            value: null,
            valid: true
          };
        }

        if (value) {
          let emailRegex = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
          if ((emailRegex === null)) {
            error = true;
          }

          setsEmail[item][index] = {
            value: value,
            valid: (emailRegex !== null) ? true : false
          };

        }

      }

      addeMailSeats(setsEmail);
      this.setState({setsEmail});

    }

    if (error) {
      disableHandler(true);
    }

  };

  componentDidMount() {
    const {firstRun} = this.state;
    if (!firstRun) {
      this.handleOnChange('email-for-sate-hidden');
      this.setState({firstRun: true});
    }
  }

  render() {
    const {index, item, userEmail} = this.props;
    const {setsEmail} = this.state;
    let emailsForSeates = [];
    let emailsForSeatesHidden = [];
    for (var i = 0; i < item.quantity; i++) {
      let valid = true;
      if (
        setsEmail.hasOwnProperty(item.giftcard.id)
        && setsEmail[item.giftcard.id].hasOwnProperty(i)
        && !setsEmail[item.giftcard.id][i].valid
      ) {
        valid = false;
      }
      let key = item.giftcard.id + '-' + i;
      if (!this.state.defaultEmail.hasOwnProperty(key)) {
        this.state.defaultEmail = {...this.state.defaultEmail, ...{[key]: null}};
      }

      emailsForSeates.push(
        <div className="form-group display-block" key={i}>
          <input
            type="text"
            className={"form-control coupon-code email-for-sate"}
            value={(this.state.defaultEmail[key] === null) ? userEmail : this.state.defaultEmail[key]}
            placeholder="Email"
            data-item={item.giftcard.id}
            data-key={i}
            onChange={(e) => {
              this.validEmailSeats('email-for-sate', e, key);
            }}
          />
          <br/>
          {(!valid) ? (
            <p className="text-danger-checkout-seat-email">Please enter a valid email address.</p>) : ''}
        </div>
      );

      emailsForSeatesHidden.push(
        <input
          key={i}
          type="hidden"
          className={"email-for-sate-hidden"}
          value={this.state.defaultEmail[key] || userEmail}
          placeholder="Email"
          data-item={item.giftcard.id}
          data-key={i}
        />
      );
    }


    return (
      <div className="shopbilling-cart-block" key={index}>
        <div className="left-block">
          <i className="fa fa-angle-right" aria-hidden="true"></i>
          <div className="pro-view-tile">
            <h4>{item.giftcard.title}</h4>
            {emailsForSeatesHidden}
          </div>
          <div className="pro-view-detial">
            <div className="categ">Quantity : <span>{item.quantity}</span></div>
            <div className="categ">Type :
              <span> Gift Card</span>
            </div>
            <div className="coupon-cart checkout-accodion-option">
              <Accordion>
                <AccordionItem>
                  <AccordionItemTitle>
                    <h3 className="u-position-relative">
                      Please enter a valid email address to send the gift card or leave the
                      default billing email.
                      <div className="acc_icon" role="presentation"/>
                    </h3>
                  </AccordionItemTitle>
                  <AccordionItemBody>
                    <div className="form-bill-wrap">
                      {emailsForSeates}
                    </div>
                  </AccordionItemBody>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
        <div className="right-block">
          <div className="bill-price">
                        < span> ${
                          (item.giftcard.giftcardPrice) ? item.giftcard.giftcardPrice : null
                        } </span>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutCartWithLogin;
