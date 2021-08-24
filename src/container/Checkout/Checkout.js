import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {cartListWithLoginRequest, cartListWithoutLoginRequest} from '../../actions';
import {ToastStore} from 'react-toasts';
import {ApiHelper} from '../../helpers/ApiHelper';
import AuthorizeForm from './AuthorizeForm';
import CheckoutCartWithLogin from './CheckoutCartWithLogin';
import NoCart from '../../components/Static/Common/NoCart';
import {InfiniteLoaders, Loader} from '../../components/Static/Common/Loader/Loader';
import {validation} from "../../config/validationError";
import {Accordion, AccordionItem, AccordionItemBody, AccordionItemTitle,} from 'react-accessible-accordion';
import moment from 'moment-timezone';

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayShipping: 'display-none',
      shippingAddress: false,
      countryData: [],
      stateData: [],
      cityData: [],
      countrySelected: '231',
      stateSelected: '',
      citySelected: '',
      countryShipdata: [],
      stateShipData: [],
      cityShipData: [],
      countryShipSelected: '231',
      stateShipSelected: '',
      cityShipSelected: '',
      firstName: '',
      lastName: '',
      contactNumber: '',
      email: '',
      country: '',
      state: '',
      city: '',
      postalCode: '',
      address: '',
      note: '',
      shipping_firstName: '',
      shipping_lastName: '',
      shipping_country: '',
      shipping_state: '',
      shipping_city: '',
      shipping_postalCode: '',
      shipping_address: '',
      shipping_address2: '',
      displayAuthModel: false,
      errorAuth: false,
      errorMessage: '',
      loaderDisplay: false,
      discount: 0,
      promoCode: '',
      disabled: false,
      emailSetErrors: false,
      newTotal: false,
      hideSubmitButton: false,
      errorMessageBackCart: '',
      isSubmitted: false,
      isApplyDisable: false,
      acceptButton: false,
      address2: '',
      selectRewardPoint: false,
      rewardInDollor: 0,
      isApplyDisableReward: false,
      emailSeats: {},
      giftCard: '',
      arGiftCard: [],
      arGiftCardComplit: null,
      selectGiftCard: false,
      isApplyDisableGiftCard: false,
      giftCardInDollor: 0,
      showCodeList: false,
      taxAmount: 0,
      rsrData: {},
      rsrResult: {},
      rsrCounts: {},
      checkRSR: false,
    };
    this.stateUser = '';
  }

  // async changeCountry(e) {
  // 	this.setState({ countrySelected: e.target.value });
  // }

  async changeState(e) {
    this.setState({stateSelected: e.target.value});
    this.stateUser = e.target.value;
    this.calculateCost('all');
  }

  async changeCity(e) {
    this.setState({citySelected: e.target.value});
  }


  addeMailSeats = (emailSeats) => {
    this.setState({emailSeats});
  };

  async changeShipState(e) {
    this.setState({stateShipSelected: e.target.value});
    this.setState({cityShipSelected: ''});
    let data = {
      countryId: this.state.countryShipSelected,
      stateId: e.target.value
    };
    let api = new ApiHelper();
    let result = await api.FetchFromServer('/', 'userCart/state', 'GET', false, data, undefined);
    const cityThis = this;
    if (!result.isError) {
      cityThis.setState({cityShipData: result.data.cities});
    }
  }

  async changeShippingCity(e) {
    this.setState({cityShipSelected: e.target.value});
  }

  async componentWillMount() {
    // let cartProductSession=JSON.parse(localStorage.getItem('cartProduct'));
    const storageSession = JSON.parse(localStorage.getItem('localStorageVal'));
    if (storageSession) {
      let api = new ApiHelper();
      let result = await api.FetchFromServer('/', 'user/profile', 'GET', true, undefined);
      if (!result.isError) {
        const dataValue = result.data.data;
        this.setState({
          firstName: dataValue.firstName,
          lastName: dataValue.lastName,
          contactNumber: dataValue.contactNumber,
          email: dataValue.email,
          stateSelected: dataValue.state ? dataValue.state : '',
          citySelected: dataValue.city ? dataValue.city : '',
          postalCode: dataValue.postalCode ? dataValue.postalCode : '',
          address: dataValue.address ? dataValue.address : '',
          address2: dataValue.address2 ? dataValue.address2 : '',
          rewardPoint: dataValue.rewardPoint ? dataValue.rewardPoint : 0
        });
      }
      this.props.cartDataWithLogin();
    } else {
      this.props.cartData();
    }
    // country data
    let api = new ApiHelper();
    let result = await api.FetchFromServer('/', 'userCart/getCountries', 'GET', false, undefined, undefined);
    if (!result.isError) {
      this.setState({countryData: result.data.data});
      this.setState({countryShipData: result.data.data});
    }

    // city data
    let data = {
      countryId: this.state.countrySelected,
      stateId: ''
    };
    let resultcity = await api.FetchFromServer('/', 'userCart/state', 'GET', false, data, undefined);
    const stateThis = this;
    if (!resultcity.isError) {
      stateThis.setState({
        stateData: resultcity.data.states,
        stateShipData: resultcity.data.states
      });
      stateThis.setState({cityData: []});
    }
    this.setState({countryShipSelected: this.state.countryShipSelected});

    this.calculateCost('all');
  }

  handleChangeChk = (checkedValue) => {
    if (this.state.shippingAddress) {
      this.setState({
        shippingAddress: !this.state.shippingAddress,
        displayShipping: 'display-none'
      });
    } else {
      this.setState({
        shippingAddress: !this.state.shippingAddress,
        displayShipping: ''
      });
    }
  };

  eventHandler = (e) => {
    if (e.target.name === 'contactNumber' || e.target.name === 'shipping_contactNumber') {
      if (isNaN(e.target.value)) {
        return;
      }
    }
    this.setState({[e.target.name]: e.target.value});
  };

  errorHandler = () => {
    setTimeout(() => {
      this.setState({
        disabled: false,
        isSubmitted: false
      });
    }, 3000);
  };

  disableHandler = (is) => {
    this.setState({
      emailSetErrors: is,
    });
  };

  isMaintenanceTime() {
    const startTime = moment().tz('America/New_York').set({hour: 2, minute: 55, second: 0, millisecond: 0});
    const endTime = moment().tz('America/New_York').set({hour: 4, minute: 0, second: 0, millisecond: 0});
    return moment().isBetween(startTime, endTime);
  }

  async submitOrder() {
    let {cartDataState} = this.props;

    if (cartDataState && cartDataState.hasOwnProperty('cartProduct') && cartDataState.cartProduct.hasOwnProperty('product')) {
      cartDataState.cartProduct = cartDataState.cartProduct.product;
    }

    let billing_country = this.state.countrySelected;
    let billing_state = this.state.stateSelected;
    let billing_city = this.state.citySelected;

    let shipping_country = this.state.countryShipSelected;
    let shipping_state = ""; ///document.getElementById('shipping_state').value;
    let shipping_city = ""; //document.getElementById('shipping_city').value;

    this.setState({
      country: billing_country,
      state: billing_state,
      city: billing_city,
      shipping_country: shipping_country,
      shipping_state: shipping_state,
      shipping_city: shipping_city,
      isSubmitted: true
    });

    if (this.state.emailSetErrors) {
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    }

    var nameRegex = this.state.firstName.match(/^[a-zA-Z][a-zA-Z\s]*$/);
    if (this.state.firstName === '') {
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    } else if (!nameRegex) {
      //ToastStore.error("First name should contain all the letters.");
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    }

    var lastNameRegex = this.state.lastName.match(/^[a-zA-Z][a-zA-Z\s]*$/);
    if (this.state.lastName === '') {
      //ToastStore.error("Last name is required");
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    } else if (!lastNameRegex) {
      //ToastStore.error("Last name should contain all the letters.");
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    }

    var contactRegex = this.state.contactNumber.match(/^\d{7,14}$/);
    if (this.state.contactNumber === '') {
      //ToastStore.error("Mobile Number is Required");
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    } else if (!contactRegex) {
      ToastStore.error('Mobile Number is invalid');
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    }

    var emailRegex = this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    if (this.state.email === '') {
      //ToastStore.error("Email is Required");
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    } else if (!emailRegex) {
      ToastStore.error('Email is invalid');
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    }

    if (billing_country === '') {
      // ToastStore.error("Country is Required");
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    }
    if (billing_state === '') {
      //ToastStore.error("State is Required");
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    }
    if (billing_city === '') {
      //ToastStore.error("City is Required");
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    }
    var billingCityRegex = billing_city.match(/^[a-zA-Z.][a-zA-Z.\s]*$/);
    if (!billingCityRegex) {
      ToastStore.error('City should contain all the letters.');
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    }

    if (this.state.postalCode === '') {
      // ToastStore.error("Postal Code is Required");
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    }

    if (this.state.address === '') {
      //ToastStore.error("Address is Required");
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    }
    if (!this.state.acceptButton) {
      //ToastStore.error("Address is Required");
      this.setState({
        disabled: true
      });
      this.errorHandler();
      return;
    }

    nameRegex = this.state.shipping_firstName.match(/^[a-zA-Z][a-zA-Z\s]*$/);
    if (this.state.shippingAddress) {
      if (this.state.shipping_firstName === '') {
        // ToastStore.error("Shipping First name is required");
        this.setState({
          disabled: true
        });
        this.errorHandler();
        return;
      } else if (!nameRegex) {
        // ToastStore.error("Shipping First Name should contain all the letters.");
        this.setState({
          disabled: true
        });
        this.errorHandler();
        return;
      }
      lastNameRegex = this.state.shipping_lastName.match(/^[a-zA-Z][a-zA-Z\s]*$/);
      if (this.state.shipping_lastName === '') {
        // ToastStore.error("Shipping Last name is required");
        this.setState({
          disabled: true
        });
        this.errorHandler();
        return;
      } else if (!lastNameRegex) {
        ToastStore.error('Shipping Last Name should contain all the letters.');
        this.setState({
          disabled: true
        });
        this.errorHandler();
        return;
      }

      if (shipping_country === '') {
        //ToastStore.error("Shipping Country is Required");
        this.setState({
          disabled: true
        });
        this.errorHandler();
        return;
      }
      if (shipping_state === '') {
        //ToastStore.error("Shipping State is Required");
        this.setState({
          disabled: true
        });
        this.errorHandler();
        return;
      }
      if (shipping_city === '') {
        // ToastStore.error("Shipping City is Required");
        this.setState({
          disabled: true
        });
        this.errorHandler();
        return;
      }
      if (this.state.shipping_postalCode === '') {
        // ToastStore.error("Shipping Postal Code is Required");
        this.setState({
          disabled: true
        });
        this.errorHandler();
        return;
      }

      if (this.state.shipping_address === '') {
        // ToastStore.error("Shipping Address is Required");
        this.setState({
          disabled: true
        });
        this.errorHandler();
        return;
      }

    }


    //let itemsRSR = [];
    let itemsCount = [];
    const itemsRSR = [];
    if (cartDataState.cartProduct) {
      for (let i in cartDataState.cartProduct) {
        const product = (cartDataState.cartProduct[i].product) ? cartDataState.cartProduct[i].product : false;
        console.log(product);
        if (product) {
          const isRSRProduct = product.productsphysicaldetail && product.productsphysicaldetail.data;
          const data = product.productsphysicaldetail && product.productsphysicaldetail.data;

          if (isRSRProduct && product.dropshippable) {

            const item = {
              count: cartDataState.cartProduct[i].quantity
            };

            itemsRSR.push(data['RSR Stock Number'] || data['SKU']);
            item.code = data['RSR Stock Number'] || data['SKU'];
            itemsCount.push(item);
          }

        }
      }
    }

    let canPay = true;
    console.log(itemsRSR);
    if (itemsRSR.length > 0) {
      const api = new ApiHelper();
      let ShipState = (shipping_state) ? shipping_state : billing_state;
      let rsrResult = {};

      for (let i in this.state.stateData) {
        if (+this.state.stateData[i].id === +ShipState && this.state.stateData[i].code) {
          ShipState = this.state.stateData[i].code;
        }
      }

      this.state.rsrData = {
        'ShipCity': (shipping_city) ? shipping_city : billing_city,
        'ShipState': ShipState,
        'ShipZip': (this.state.shipping_postalCode) ? this.state.shipping_postalCode : this.state.postalCode,
        'ShipAddress': (this.state.shipping_address) ? this.state.shipping_address : this.state.address,
        'Items': itemsRSR
      };

      this.setState({checkRSR: true});
      const rsrCheck = await api.FetchFromServer(
        "/",
        "product/checkRSRData",
        "POST",
        true,
        undefined,
        this.state.rsrData
      );

      console.log(rsrCheck);
      if (rsrCheck.isError) {
        return;
      } else {
        if (rsrCheck.data && rsrCheck.data.data && rsrCheck.data.data.Items) {
          for (let i in rsrCheck.data.data.Items) {
            let item = rsrCheck.data.data.Items[i];
            const code = item['PartNum'];

            rsrResult = {...rsrResult, [code]: {...item, 'WishQty': 0}};
            if (item['StatusCode'] !== "00") {
              canPay = false;
            }

            for (let j in itemsCount) {
              const sameCode = `${itemsCount[j].code}` === `${code}`;
              if (sameCode) {
                rsrResult[itemsCount[j].code]['WishQty'] = itemsCount[j].count;
              }

              if (sameCode && +itemsCount[j].count > +item['OnHand']) {
                canPay = false;
              }
            }

          }
        }

        if (rsrCheck.data.data.StatusCode && rsrCheck.data.data.StatusCode !== '00') {
          canPay = false;
          ToastStore.error(rsrCheck.data.data.StatusMssg || "Error");
        }

        this.state.rsrResult = {...rsrResult};
        this.setState({checkRSR: false});
      }
    }


    if (canPay) {
      this.setState({displayAuthModel: true});
    }


    /**
     * update user profile
     */
    this.saveUserData().catch((e) => console.log(e));
  }

  async saveUserData() {
    const {
      firstName, lastName, contactNumber, email, countrySelected, stateSelected, citySelected, postalCode,
      address, address2
    } = this.state;

    const addressData = {
      firstName: firstName,
      lastName: lastName,
      contactNumber: contactNumber,
      //email: email,
      country: countrySelected,
      address: address,
      address2: address2,
      city: citySelected,
      state: stateSelected,
      postalCode: postalCode
    };
    const api = new ApiHelper();
    await api.FetchFromServer(
      "/",
      "user/updateProfile",
      "PUT",
      true,
      undefined,
      addressData
    );
  }

  buildEmailSeats() {
    const emailSeats = document.getElementsByClassName('email-for-sate');
    let setsEmail = [];
    let index = 0;
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
          setsEmail[item][index] = {
            value: value,
            valid: (emailRegex !== null) ? true : false
          };

        }

      }
    }

    this.setState({emailSeats: setsEmail});
  }

  async paymentData(paymentData) {
    this.setState({
      errorAuth: false,
      errorMessage: '',
      loaderDisplay: true
    });
    const storageSession = JSON.parse(localStorage.getItem('localStorageVal'));
    let billing_country = this.state.countrySelected;
    let billing_state = document.getElementById('billing_state').value;
    let billing_city = document.getElementById('billing_city').value;

    let shipping_country = this.state.countryShipSelected;
    let shipping_state = ""; //document.getElementById('shipping_state').value;
    let shipping_city = ""; //document.getElementById('shipping_city').value;

    var billing_address = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      contactNumber: this.state.contactNumber,
      email: this.state.email,
      country: billing_country,
      state: billing_state,
      city: billing_city,
      postalCode: this.state.postalCode,
      address: this.state.address,
      address2: this.state.address2
    };

    var shipping_address = {
      shipping_firstName: this.state.shipping_firstName,
      shipping_lastName: this.state.shipping_lastName,
      // shipping_contactNumber: this.state.shipping_contactNumber,
      // shipping_email: this.state.shipping_email,
      shipping_country: shipping_country,
      shipping_state: shipping_state,
      shipping_city: shipping_city,
      shipping_postalCode: this.state.shipping_postalCode,
      shipping_address: this.state.shipping_address,
      shipping_address2: this.state.shipping_address2
    };

    let email = this.state.email;
    // if (this.state.shippingAddress) {
    // 	email = this.state.shipping_email;
    // } else {
    // 	email = this.state.email;
    // }

    // let dataarray = [];
    let cartProductSession = JSON.parse(localStorage.getItem('cartProduct'));
    let userIs = 'User';
    const {cartDataState} = this.props;
    let productArray = [];
    // let formatted;
    if (storageSession) {
      let cartData = cartDataState.cartProduct;
      let cartLength = cartData.length;

      for (let i = 0; i < cartLength; i++) {
        //productArray.push(cartData[i].product.id + '-' + cartData[i].quantity);
        if (cartData[i].type === 'giftcard') {
          productArray.push(
            {
              "productId": cartData[i].giftcard.id,
              "type": cartData[i].type,
              "quantity": cartData[i].quantity,
              "customAmount": cartData[i].customAmount || null,
              "emails": this.state.emailSeats[cartData[i].giftcard.id] || {}
            }
          );
        } else {
          productArray.push(
            {
              "productId": cartData[i].product.id,
              "type": cartData[i].type,
              "quantity": cartData[i].quantity
            }
          );
        }

      }
    } else {
      let cartData = cartProductSession.product;
      let cartLength = cartProductSession.product.length;
      for (let i = 0; i < cartLength; i++) {
        if (cartData[i].type === 'giftcard') {
          if (!this.state.emailSeats) {
            this.buildEmailSeats();
          }
          productArray.push(
            {
              "productId": cartData[i].productId,
              "type": cartData[i].type,
              "quantity": cartData[i].count,
              "emails": this.state.emailSeats[cartData[i].productId] || {},
              "customAmount": cartData[i].customAmount || null,
            }
          );
        } else {
          productArray.push(
            {
              "productId": cartData[i].productId,
              "type": cartData[i].type,
              "quantity": cartData[i].count
            }
          );
        }
      }
      userIs = 'Guest User';
    }
    let api = new ApiHelper();
    // var dataProduct = { products: dataarray.products };
    let productDetailCheck = await api.FetchFromServer('/', 'product/get', 'POST', false, undefined, productArray);
    let displaySubmit = false;
    if (productDetailCheck.isError) {
      return;
    } else {
      let productArray = productDetailCheck.data.data;

      for (let i = 0; i < productArray.length; i++) {
        if (productArray[i].type === "giftcard") {
          if (productArray[i].giftcard.isActive === false) {
            displaySubmit = true;
            break;
          }
        }
        if (productArray[i].type === "physical") {
          if (productArray[i].product.isActive === false) {
            displaySubmit = true;
            break;
          }
        }

      }
      if (displaySubmit) {
        this.setState({
          hideSubmitButton: true,
          errorMessageBackCart: 'Check your cart, some product is not available',
          displayAuthModel: false
        });
      } else {
        this.setState({
          hideSubmitButton: false,
          errorMessageBackCart: '',
          displayAuthModel: true
        });
      }
    }
    if (!displaySubmit) {
      let data = {
        email: email,
        billingAddress: billing_address,
        shippingAddress: shipping_address,
        notes: this.state.note,
        paymentType: 'authorized',
        userStatus: userIs,
        shipStatus: this.state.shippingAddress,
        products: productArray,
        discount: parseInt(this.state.discount),
        useRewardPoints: this.state.selectRewardPoint,
        rewardPoint: this.state.rewardPoint,
        coupan: parseInt(this.state.discount) ? this.state.promoCode || "" : "",
        cardData: paymentData,
        rsrResult: this.state.rsrResult,
        rsrRespons: this.state.rsrData,
        giftCardCodeApplied: this.state.giftCardInDollor ? this.state.arGiftCard || "" : "",
        redeemGiftCardPrice: this.state.giftCardInDollor
      };


      let api = new ApiHelper();
      let resultdata = '';
      if (storageSession) {
        resultdata = await api.FetchFromServer('/', 'order', 'POST', true, undefined, data);
      } else {
        resultdata = await api.FetchFromServer('/', 'order', 'POST', false, undefined, data);
      }
      if (resultdata.isError) {
        //ToastStore.error(resultdata.messages[0]);
        this.setState({
          errorAuth: true,
          errorMessage: resultdata.messages[0],
          loaderDisplay: false
        });
      } else {
        this.setState({
          loaderDisplay: false
        });
        localStorage.removeItem('cartProduct');
        localStorage.removeItem('loginCartItemForCheckout');
        const {history} = this.props;
        history.push({
          pathname: '/payment-success/' + resultdata.data.id
          // state: { checkoutboolean: true }
        });
        //ToastStore.success("Payment Successful");
      }
    }
  }

  closeAuthFunction = (dataBoolean) => {
    this.setState({displayAuthModel: dataBoolean});
  };

  onChangeCoupan = (e) => {
    this.setState({
      promoCode: e.target.value
    });
  };


  async setAcceptRewardValue() {
    let selectRewardPoint;
    if (!this.state.selectRewardPoint) {
      this.setState({
        selectRewardPoint: true,
      });
      selectRewardPoint = true;
    } else {
      this.setState({
        selectRewardPoint: false
      });
      selectRewardPoint = false;
    }

    this.calculateCost('point', selectRewardPoint);
  }


  setAcceptButtonValue = () => {
    this.setState({acceptButton: !this.state.acceptButton});
  };

  calculateCost = async (type, selectRewardPointNow) => {

    const {giftCard, promoCode, selectRewardPoint, stateSelected, arGiftCard} = this.state;
    let {cartDataState} = this.props;

    let arGiftCardNew = arGiftCard;

    if (giftCard) {
      arGiftCardNew.push(giftCard);
    }

    const result = await new ApiHelper().FetchFromServer('/', 'userCart/calculateCost', 'POST', true, undefined, {
      giftCardCode: giftCard,
      arGiftCardCode: arGiftCardNew,
      promoCode: promoCode,
      stateId: this.stateUser || stateSelected,
      selectRewardPoint: (type === 'point') ? selectRewardPointNow : selectRewardPoint,
      products: cartDataState.cartProduct
    });

    const data = result.data.data;

    setTimeout(() => {
      this.setState({isApplyDisable: false});
    }, 3000);

    if (type === 'cupon') {
      if (
        data.cuponResult
        && data.cuponResult.hasOwnProperty('offerDiscount')
        && data.cuponResult.offerDiscount > 0
      ) {
        ToastStore.success('Code applied successfully!');
      } else {
        ToastStore.error('Invalid Coupon Code');
      }
      this.setState({
        discount: (data.coupanDiscount).toFixed(2),
        giftCardInDollor: data.redeemGiftCardPrice,
        rewardInDollor: data.rewardPointInDollar.toFixed(2),
        taxAmount: data.taxAmount.toFixed(2),
        giftCard: '',
        arGiftCardComplit: data.arGiftCardCodeInt,
      });
    }

    if (type === 'gift') {

      if (!data.badLastGift) {
        ToastStore.success('Gift Card applied successfully!');
      } else {
        ToastStore.error('Invalid Gift Card');
      }


      if (data.arGiftCardCodeInt.len > 0) {
        arGiftCardNew = [];
        for (let i in data.arGiftCardCodeInt.code) {
          const complGift = data.arGiftCardCodeInt.code[i];
          arGiftCardNew.push(complGift.giftcard);
        }
      }

      this.setState({
        discount: (data.coupanDiscount).toFixed(2),
        giftCardInDollor: data.redeemGiftCardPrice,
        rewardInDollor: data.rewardPointInDollar.toFixed(2),
        taxAmount: data.taxAmount.toFixed(2),
        giftCard: '',
        arGiftCard: arGiftCardNew,
        arGiftCardComplit: data.arGiftCardCodeInt,
      });
    }

    if (type === 'point') {
      if (data.rewardPoint > 0) {
        ToastStore.success('Reward applied successfully!');
      }
      this.setState({
        rewardInDollor: data.rewardPointInDollar.toFixed(2),
        discount: (data.coupanDiscount).toFixed(2),
        giftCardInDollor: data.redeemGiftCardPrice,
        taxAmount: data.taxAmount.toFixed(2),
        giftCard: '',
        arGiftCardComplit: data.arGiftCardCodeInt,
      });
    }

    if (type === 'all') {
      this.setState({
        rewardInDollor: data.rewardPointInDollar.toFixed(2),
        discount: (data.coupanDiscount).toFixed(2),
        giftCardInDollor: data.redeemGiftCardPrice,
        taxAmount: data.taxAmount.toFixed(2),
        giftCard: '',
        arGiftCardComplit: data.arGiftCardCodeInt,
      });
    }

    this.setState({newTotal: data.newTotalAmount.toFixed(2)});

  };

  onlyGiftCart() {
    let {cartDataState} = this.props;
    if (cartDataState.hasOwnProperty('cartProduct') && cartDataState.cartProduct.length > 0) {
      for (let i in cartDataState.cartProduct) {
        if (cartDataState.cartProduct[i].type === 'physical') {
          return false;
        }
      }
    }
    return true;
  }

  showCodeList = () => {
    const {showCodeList} = this.state;
    this.setState(
      {
        showCodeList: (!showCodeList)
      }
    );
  };

  onChangeGiftCard = (e) => {
    this.setState({
      giftCard: e.target.value
    });
  };

  isSelectCode = (code) => {
    let {arGiftCardComplit} = this.state;
    if (arGiftCardComplit.len > 0) {
      for (const i in arGiftCardComplit.code) {
        const selectCode = arGiftCardComplit.code[i].giftcard;
        if (selectCode === code) {
          return true;
        }
      }
    }

    return false;
  };

  removeCart = (code) => {
    const {arGiftCard} = this.state;
    let newArGiftCard = [];
    if (arGiftCard && arGiftCard.length > 0) {
      for (let i in arGiftCard) {
        if (arGiftCard[i] !== code) {
          newArGiftCard.push(arGiftCard[i]);
        }
      }
    }

    this.state.arGiftCard = newArGiftCard;

    this.calculateCost('gift');
  };

  setSelectCode = (e) => {
    if (e.target.value && e.target.value !== '0') {
      this.setState({
        giftCard: e.target.value,
        showCodeList: false
      });
    }
  };

  render() {
    let {cartDataState, profileInfo} = this.props;
    let {newTotal, showCodeList, arGiftCardComplit} = this.state;
    const storageSession = JSON.parse(localStorage.getItem('localStorageVal'));

    if (cartDataState && cartDataState.hasOwnProperty('cartProduct') && cartDataState.cartProduct.hasOwnProperty('product')) {
      cartDataState.cartProduct = cartDataState.cartProduct.product;
    }

    const totalAmount = (newTotal) ? newTotal : cartDataState.total;

    return (
      <section className="shoping-billing-page minHight">
        <nav className="breadcrumb">
          <ul>
            {/* <li><a href="/">Home</a></li> */}
            <li>
              <a href="/cart">cart</a>
            </li>
            <li>Checkout</li>
          </ul>
        </nav>
        {cartDataState.isLoading ? <Loader/> : null}
        {cartDataState.cartProduct && cartDataState.cartProduct.length ? (
          <div className="row">
            <div className="col-md-6 product-cart-info">
              <div className="product-cart-info-holder">
                <div className="back-to-cart">
                  <a href="/cart">
                    <i className="fa fa-angle-left" aria-hidden={true}/> Back to Cart
                  </a>
                </div>
                <div className="order-review">
                  <h3>
                    <span>Order Overview</span>
                  </h3>
                </div>

                <CheckoutCartWithLogin
                  cartDataState={cartDataState}
                  disableHandler={this.disableHandler}
                  addeMailSeats={this.addeMailSeats}
                  userEmail={this.state.email}
                  rsrResult={this.state.rsrResult}
                />


                <div className="order-summary-warp">
                  <div className="order-total-table-warp">
                    {this.onlyGiftCart() ? null : (
                      <div className="cart-coupon-wrap">
                        <h4>Choose any one of them</h4>
                        <div className="coupon-cart checkout-accodion-option">
                          {storageSession ? parseInt(profileInfo.profileInfo.rewardPoint) > 0 ? (
                            <Accordion>
                              <AccordionItem>
                                <AccordionItemTitle>
                                  <h3 className="u-position-relative">
                                    Use Reward Points
                                    <div className="acc_icon" role="presentation"/>
                                  </h3>
                                </AccordionItemTitle>
                                <AccordionItemBody>
                                  <div className="termsPage-checkout bold">
                                    {this.state.isApplyDisableReward ? (
                                      <input
                                        disabled
                                        type="checkbox"
                                        value={this.state.selectRewardPoint}
                                        checked={this.state.selectRewardPoint}
                                      />
                                    ) : (
                                      <input
                                        type="checkbox"
                                        onChange={this.setAcceptRewardValue.bind(this)}
                                        value={this.state.selectRewardPoint}
                                        checked={this.state.selectRewardPoint}
                                      />
                                    )}
                                    &nbsp;<span>
                                                                            Use Reward points - You have{' '}
                                    {profileInfo.profileInfo.rewardPoint} Points
                                                                </span>
                                  </div>
                                </AccordionItemBody>
                              </AccordionItem>
                            </Accordion>
                          ) : null : null}
                          <Accordion>
                            <AccordionItem>
                              <AccordionItemTitle>
                                <h3 className="u-position-relative">
                                  Add Promo Code or Coupon
                                  <div className="acc_icon" role="presentation"/>
                                </h3>
                              </AccordionItemTitle>
                              <AccordionItemBody>
                                <div className="form-group">
                                  <input
                                    type="text"
                                    name="coupon-code"
                                    className="form-control coupon-code"
                                    id=""
                                    value={this.state.promoCode}
                                    onChange={this.onChangeCoupan}
                                    placeholder="Have a promo code or сoupon?"
                                  />
                                  {this.state.isApplyDisable ? (
                                    <button className="btn-effect one apply-btn"
                                            disabled>
                                      Apply
                                    </button>
                                  ) : (
                                    <button
                                      className="btn-effect one apply-btn"
                                      name="apply_coupon"
                                      value="Apply coupon"
                                      onClick={() => {
                                        this.calculateCost('cupon');
                                      }}
                                    >
                                      Apply
                                    </button>
                                  )}
                                </div>
                              </AccordionItemBody>
                            </AccordionItem>
                          </Accordion>
                          <Accordion>
                            <AccordionItem>
                              <AccordionItemTitle>
                                <h3 className="u-position-relative">
                                  Add Gift Card
                                  <div className="acc_icon" role="presentation"/>
                                </h3>
                              </AccordionItemTitle>
                              <AccordionItemBody>
                                {(arGiftCardComplit && arGiftCardComplit.len > 0) ?

                                  (
                                    arGiftCardComplit.code.map((item, index) => {
                                      return <div><span>{item.giftcard} - ${item.price}</span> | <span
                                        onClick={this.removeCart.bind(this, item.giftcard)}
                                        class="remove-link cursor-point"><i class="fa fa-trash" aria-hidden="true"></i> Remove</span>
                                      </div>;
                                    })

                                  ) : null
                                }
                                <div className="form-group">
                                  <input
                                    type="text"
                                    name="gift-card"
                                    className="form-control coupon-code"
                                    id="gift-card"
                                    value={this.state.giftCard}
                                    onChange={this.onChangeGiftCard}
                                    placeholder="Have a gift card?"
                                  />

                                  {(showCodeList && profileInfo.profileInfo && profileInfo.profileInfo.code) ?
                                    (<select size="5" className="codeList"
                                             onChange={this.setSelectCode}>
                                      <option value="0">Choose your code</option>
                                      {profileInfo.profileInfo.code &&
                                      profileInfo.profileInfo.code.map((item, index) => {
                                        if (!this.isSelectCode(item.giftCardCode)) {
                                          return <option value={item.giftCardCode}>{item.giftCardCode}</option>;
                                        }
                                      })
                                      }

                                    </select>)
                                    : null

                                  }

                                  {(profileInfo.profileInfo && profileInfo.profileInfo.code) ?
                                    (<button
                                      className="btn-effect one apply-btn list-code-btn"
                                      name="apply_coupon"
                                      value="Apply coupon"
                                      onClick={this.showCodeList}
                                    >
                                      {
                                        (showCodeList)
                                          ? (<img
                                            src="/assets/img/icons/left.svg"
                                            width="12" alt=""/>)
                                          : (<img
                                            src="/assets/img/icons/down.svg"
                                            width="20" alt=""/>)
                                      }

                                    </button>)
                                    : null

                                  }
                                  {this.state.isApplyDisableGiftCard ? (
                                    <button className="btn-effect one apply-btn"
                                            disabled>
                                      Apply
                                    </button>
                                  ) : (
                                    <button
                                      className="btn-effect one apply-btn"
                                      name="apply_coupon"
                                      value="Apply coupon"
                                      onClick={() => {
                                        this.calculateCost('gift');
                                      }}
                                    >
                                      Apply
                                    </button>
                                  )}
                                </div>
                              </AccordionItemBody>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </div>
                    )}
                    <table
                      className="table text-right noline-table order-summary-total table-condensed">
                      <tbody>
                      <tr>
                        <th className="text-right">Subtotal :</th>
                        <td>${cartDataState.subTotal}</td>
                      </tr>
                      <tr>
                        <th className="text-right">Shipping :</th>
                        <td>${cartDataState.shipping}</td>
                      </tr>
                      {this.state.taxAmount > 0 ? (
                          <tr>
                            <td>Tax :</td>
                            <td>${this.state.taxAmount}</td>
                          </tr>
                        ) :
                        null
                      }
                      {this.state.discount > 0 ? (
                        <tr>
                          <th className="text-right">Discount :</th>
                          <td>- ${this.state.discount}</td>
                        </tr>
                      ) : null}
                      {this.state.rewardInDollor > 0 ? (
                        <tr>
                          <td>Reward Amount:</td>
                          <td>-
                            ${this.state.rewardInDollor > 0 ? this.state.rewardInDollor : 0}</td>
                        </tr>
                      ) : null}
                      {this.state.giftCardInDollor > 0 ? (
                          <tr>
                            <td>Gift Card Amount :</td>
                            <td>- ${this.state.giftCardInDollor}</td>
                          </tr>
                        ) :
                        null
                      }
                      <tr className="grand-total-tr">
                        <th className="text-right">
                          <strong>TOTAL :</strong>
                        </th>
                        <td>
                          <strong>
                            ${totalAmount}
                          </strong>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
            <div className="col-md-6 billing-shipping-wrapper">
              <div className="row">
                <div className="col-sm-6 billing-address-block">
                  <div className="billing-address-inner clearfix">
                    <h4 className="heading">
                      <span>Billing Address</span>
                    </h4>
                    <form id="billingForm">
                      <div className="form-bill-wrap">
                        <div className="form-group">
                          <input
                            type="text"
                            name="firstName"
                            onChange={this.eventHandler}
                            className="form-control"
                            id=""
                            placeholder="First Name"
                            value={this.state.firstName}
                          />

                          {this.state.isSubmitted && this.state.firstName.trim() === '' ? (
                            <p className={'text-danger-checkout'}>
                              {validation.firstName}
                            </p>
                          ) : null}
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            name="lastName"
                            onChange={this.eventHandler}
                            className="form-control"
                            id=""
                            placeholder="Last Name"
                            value={this.state.lastName}
                          />
                          {this.state.isSubmitted && this.state.lastName.trim() === '' ? (
                            <p className={'text-danger-checkout'}>{validation.lastName}</p>
                          ) : null}
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="contactNumber"
                            onChange={this.eventHandler}
                            id="number"
                            placeholder="Mobile number"
                            value={this.state.contactNumber}
                            maxLength={14}
                          />
                          {this.state.isSubmitted && this.state.contactNumber.trim() === '' ? (
                            <p className={'text-danger-checkout'}>
                              {validation.numberInvalid}
                            </p>
                          ) : null}
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="email"
                            onChange={this.eventHandler}
                            id="Email"
                            placeholder="Email Address"
                            value={this.state.email}
                          />
                          {this.state.isSubmitted && this.state.email.trim() === '' ? (
                            <p className={'text-danger-checkout'}>{validation.emailInvalid}</p>
                          ) : null}
                        </div>
                        <div className="clearfix"/>
                        <div className="form-group">
                          <input
                            placeholder="Address"
                            className="form-control"
                            name="address"
                            onChange={this.eventHandler}
                            id=""
                            value={this.state.address}
                          />
                          {this.state.isSubmitted && this.state.address.trim() === '' ? (
                            <p className={'text-danger-checkout'}>{validation.addressValidation}</p>
                          ) : null}
                        </div>
                        <div className="clearfix"/>
                        <div className="form-group select-col">
                          <input
                            placeholder="Suite/Apt"
                            className="form-control"
                            name="address2"
                            onChange={this.eventHandler}
                            id=""
                            value={this.state.address2}
                          />
                          {/* {this.state.isSubmitted &&
                              this.state.address2.trim() === "" ? (
                              <p className={"text-danger-checkout"}>Please enter suite/apt</p>
                              ) : null} */}
                        </div>
                        <div className="form-group city-group select-col">
                          <input
                            type="text"
                            className="form-control"
                            name="city"
                            id="billing_city"
                            // autocomplete="new-city"
                            onChange={this.changeCity.bind(this)}
                            placeholder="City"
                            autoComplete="off"
                            value={this.state.citySelected}
                          />
                          {this.state.isSubmitted && this.state.citySelected.trim() === '' ? (
                            <p className={'text-danger-checkout'}>{validation.cityValidation}</p>
                          ) : null}
                        </div>
                        <div className="clearfix"/>
                        <div className="form-group state-group select-col">
                          <select
                            className="form-control"
                            name="state"
                            id="billing_state"
                            value={this.state.stateSelected}
                            onChange={this.changeState.bind(this)}
                          >
                            <option value="">Select State</option>
                            {this.state.stateData.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                          {this.state.isSubmitted && this.state.stateSelected.trim() === '' ? (
                            <p className={'text-danger-checkout'}>{validation.stateValidation}</p>
                          ) : null}
                        </div>

                        {/* <div className="clearfix" /> */}
                        <div className="form-group select-col postal-group">
                          <input
                            type="text"
                            className="form-control"
                            name="postalCode"
                            onChange={this.eventHandler}
                            id=""
                            placeholder="Postal Code"
                            value={this.state.postalCode}
                          />
                          {this.state.isSubmitted && this.state.postalCode === '' ? (
                            <p className={'text-danger-checkout'}>
                              {validation.postalValidation}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-sm-6 shipping-address-block">
                  <div className="billing-address-inner">
                    <h4 className="heading">
                      <span>Shipping Address</span>
                    </h4>

                    <div className="mt-3 mb-3">
                    For security purposes, orders will only be shipped to the address that is on file for the card being used.
                    </div>
                    {/* <div className="form-group">
                      <div className="checkbox-input">
                        <input
                          id="cat1"
                          className="styled"
                          type="checkbox"
                          name=""
                          defaultChecked={this.state.chkbox}
                          onChange={this.handleChangeChk}
                        />
                        <label htmlFor="cat1">Want to ship to a different address ?</label>
                      </div>
                    </div>
                    <div className={'form-bill-wrap ' + this.state.displayShipping}>
                      <form id="shippingForm" autoComplete="off">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            id=""
                            name="shipping_firstName"
                            onChange={this.eventHandler}
                            placeholder="First Name"
                            value={this.state.shipping_firstName}
                          />
                          {this.state.shippingAddress &&
                          this.state.isSubmitted &&
                          this.state.shipping_firstName.trim() === '' ? (
                            <p className={'text-danger-checkout'}>
                              {validation.firstName}
                            </p>
                          ) : null}
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            id=""
                            placeholder="Last Name"
                            name="shipping_lastName"
                            onChange={this.eventHandler}
                            value={this.state.shipping_lastName}
                          />
                          {this.state.isSubmitted &&
                          this.state.shipping_lastName.trim() === '' ? (
                            <p className={'text-danger-checkout'}>{validation.lastName}</p>
                          ) : null}
                        </div>
                        <div className="clearfix"/>
                        <div className="form-group">
                          <input
                            placeholder="Address"
                            className="form-control"
                            name="shipping_address"
                            value={this.state.shipping_address}
                            onChange={this.eventHandler}
                            id=""
                          />
                          {this.state.shippingAddress &&
                          this.state.isSubmitted &&
                          this.state.shipping_address.trim() === '' ? (
                            <p className={'text-danger-checkout'}>{validation.addressValidation}</p>
                          ) : null}
                        </div>
                        <div className="clearfix"/>
                        <div className="form-group select-col">
                          <input
                            placeholder="Suite/Apt"
                            className="form-control"
                            name="shipping_address2"
                            value={this.state.shipping_address2}
                            onChange={this.eventHandler}
                            id=""
                          />
                        </div>
                        <div className="form-group city-group select-col">
                          <input
                            type="text"
                            className="form-control"
                            name="shipping_city"
                            id="shipping_city"
                            onChange={this.changeShippingCity.bind(this)}
                            placeholder="City"
                          />
                          {this.state.shippingAddress &&
                          this.state.isSubmitted &&
                          this.state.shipping_city.trim() === '' ? (
                            <p className={'text-danger-checkout'}>{validation.cityValidation}</p>
                          ) : null}
                        </div>
                        <div className="clearfix"/>
                        <div className="form-group state-group select-col">
                          <select
                            name="shipping_state"
                            // value={this.state.shipping_state}
                            className="form-control"
                            id="shipping_state"
                            value={this.state.stateShipSelected}
                            onChange={this.changeShipState.bind(this)}
                          >
                            <option value="">Select State</option>
                            {this.state.stateShipData.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                          {this.state.shippingAddress &&
                          this.state.isSubmitted &&
                          this.state.shipping_state.trim() === '' ? (
                            <p className={'text-danger-checkout'}>{validation.stateValidation}</p>
                          ) : null}
                        </div>
                        {/* <div className="clearfix" /> 
                        <div className="form-group select-col">
                          <input
                            type="text"
                            className="form-control"
                            id=""
                            placeholder="Postal Code"
                            name="shipping_postalCode"
                            value={this.state.shipping_postalCode}
                            onChange={this.eventHandler}
                          />

                          {this.state.shippingAddress &&
                          this.state.isSubmitted &&
                          this.state.shipping_postalCode === '' ? (
                            <p className={'text-danger-checkout'}>
                              {validation.postalValidation}
                            </p>
                          ) : null}
                        </div>
                      </form>
                    </div>*/}

                    <div className="bill-note-box"> 
                      <div className="form-group">
												<textarea
                          placeholder="Note"
                          rows="5"
                          className="form-control"
                          id=""
                          name="note"
                          value={this.state.note}
                          onChange={this.eventHandler}
                        />
                      </div>
                    </div>
                    <div className="termsPage-checkout">
                      <input
                        type="checkbox"
                        onChange={this.setAcceptButtonValue}
                        value={this.state.acceptButton}
                        checked={this.state.acceptButton}
                      />&nbsp;
                      <span>
												{' '}
                        I agree with the{' '}
                        <Link to="/terms-and-condition" target="_blank">
													terms and conditions
												</Link>{' '}
											</span>
                    </div>
                    {this.state.isSubmitted && !this.state.acceptButton ? (
                      <p className={'text-danger'}>Please accept the terms & conditions
                      </p>
                    ) : null}
                    <div className="form-group">
                      {this.state.checkRSR ? (
                        <InfiniteLoaders/>
                      ) : this.state.hideSubmitButton ? (
                        <span>
                          {this.isMaintenanceTime() ? <p className="errorCart text-danger checkoutCatLink">
                            Checkout is currently unavailable. The website is undergoing maintenance from 2:55am until 4am EST.
                          </p> : [
                              <button
                                className="btn-orange one"
                                onClick={this.submitOrder.bind(this)}
                                disabled={this.state.disabled}
                              >Continue to Payment</button>,
                              <p className="errorCart text-danger checkoutCatLink">
                                Check your <Link to="/cart"> Cart Page </Link>, some product is
                                not available
                              </p>
                            ]
                          }
												</span>
                      ) : this.isMaintenanceTime() ?
                        <p className="errorCart text-danger checkoutCatLink">
                          Checkout is currently unavailable. The website is undergoing maintenance from 2:55am until 4am EST.
                        </p>
                        :
                        <button
                          className="btn-orange one"
                          onClick={this.submitOrder.bind(this)}
                          disabled={this.state.disabled}
                        >Continue to Payment</button>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : cartDataState.isLoading ? null : (
          <NoCart/>
        )}
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <AuthorizeForm
          displayAuthModel={this.state.displayAuthModel}
          cardTotal={totalAmount}
          paymentFunction={this.paymentData.bind(this)}
          closeAuthFunction={this.closeAuthFunction}
          errorMessage={this.state.errorMessage}
          errorAuth={this.state.errorAuth}
          loaderDisplay={this.state.loaderDisplay}
        />
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cartDataState: state.cartListWithoutLoginReducer,
    loginState: state.loginReducer,
    profileInfo: state.profileInfoReducer
  };
};
const mapDispatchProps = (dispatch) => {
  return {
    cartData: () => {
      dispatch(cartListWithoutLoginRequest());
    },
    cartDataWithLogin: () => {
      dispatch(cartListWithLoginRequest());
    }
  };
};

export default connect(mapStateToProps, mapDispatchProps)(Checkout);
