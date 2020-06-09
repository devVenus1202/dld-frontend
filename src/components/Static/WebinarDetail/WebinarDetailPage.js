import React, {Component} from "react";
import {connect} from "react-redux";
import {glloginRequest, loginCartRequest, signUpCartRequest, webinarCheckOutInfoRequest} from "../../../actions";
import AuthModel from "../Common/AuthModel/AuthModel";
import {Link} from "react-router-dom";
// import ReactImageZoom from "react-image-zoom";
import {Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import Constant from "../../../config/Constant";
import {withRouter} from "react-router";
import qs from 'query-string';
import AuthorizeForm from "../../../container/Checkout/AuthorizeForm";
import {ApiHelper} from "../../../helpers/ApiHelper";
import {ToastStore} from "react-toasts";
import Magnifier from "react-magnifier";
// import { AppConfig } from "../../../config/AppConfig";
// import { CardErrorCode } from "../../../config/CardError";
import {Accordion, AccordionItem, AccordionItemBody, AccordionItemTitle,} from 'react-accessible-accordion';
import {AppConfig} from "../../../config/AppConfig";
import {getWebinarsLink} from "../../../helpers/links";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

class WebinarDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayWebinarModel: false,
      showLoginModel: false,
      seats: [],
      availableSeat: 0,
      ReservedSeat: 0,
      reserved: 0,
      blocked: [],
      errors: [],
      uniqueNameErrorClass: "display_none",
      uniqueNameErrorMsg: "",
      payment: {
        openModal: false,
        errorMessage: "",
        errorAuth: "",
        loaderDisplay: false
      },
      newTotal: 0,
      discount: 0,
      promoCode: "",
      catalog: undefined,
      productSlug: undefined,
      displayInactiveProduct: false,
      productDeactive: false,
      acceptButton: false,
      address: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      countrySelected: '231',
      stateData: [],
      stateSelected: '',
      citySelected: '',
      selectRewardPoint: false,
      rewardInDollor: 0,
      isApplyDisableReward: false,
      windowWidthValue: false,
      updateInfo: false,
      giftCard: '',
      arGiftCard: [],
      arGiftCardComplit: null,
      selectGiftCard: false,
      isApplyDisableGiftCard: false,
      giftCardInDollor: 0,
      showCodeList: false,
      isZoomMode: false
    };
  }

  componentDidMount() {
    let winWidth = window.innerWidth;
    if (winWidth < 768) {
      this.setState({
        windowWidthValue: true
      });
    }
  }

  async componentWillMount() {
    const {match, userState} = this.props;
    const {params} = match;
    const {catalog, productslug} = params;
    const {productDetails} = this.props;
    const {productData} = productDetails;
    const {blockSeat} = productData;

    let reserved = this.decalculation(blockSeat);

    if (this.props.userState.id) {
      await this.refreshData();
    }

    this.setState({
      availableSeat: productData.remainingQuantity - reserved,
      displayWebinarModel: false,
      catalog,
      productslug,
      address: userState.address || "",
      address2: userState.address2 || "",
      citySelected: userState.city || "",
      stateSelected: userState.state || "",
      postalCode: userState.postalCode || "",
    });

    let data = {
      countryId: this.state.countrySelected,
      stateId: ''
    };
    let api = new ApiHelper();
    let resultState = await api.FetchFromServer('/', 'userCart/state', 'GET', false, data, undefined);
    if (!resultState.isError) {
      this.setState({
        blockSeat: productData.blockSeat,
        stateData: resultState.data.states,
      })
    }
  }

  async refreshData(props) {
    const {productslug} = props || this.props;
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "product/details",
      "POST",
      false,
      undefined,
      {
        productSlug: productslug,
        userId: this.props.userState.id || false
      }
    );

    if (result.isError) {
      this.setState({displayInactiveProduct: true});
    } else {
      if (result.data.data.isActive) {
        this.setState({
          showLoginModel: false,
          displayWebinarModel: false,
          blockSeat: result.data && result.data.data.blockSeat,
          availableSeat: (this.state.seats && this.state.seats.length > 0) ? result.data.data.remainingQuantity - this.state.seats.length : result.data.data.remainingQuantity
        });
        this.decalculation(result.data && result.data.data.blockSeat)
      } else {
        this.setState({displayInactiveProduct: true});
      }
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.loginState.isLoggedIn) {
      await this.refreshData(nextProps)
    }
    this.setState({
      productDetails: nextProps.productDetails || this.state.productDetails
    })
  }

  handleLogin = () => {
    this.props.openLoginPopup();
  };

  displayLoginTrigger = displayStatus => {
    this.setState({showLoginModel: false});
  };

  loginFun = data => {
    this.props.loginUser(data);
    return;
  };

  registrationFun = data => {
    this.props.signUpUser(data);
  };

  displaySeatModel() {
    let dataPass = "displaySeatModel";
    this.commonSeatCheckFun(dataPass).catch(console.log);
  };

  decalculation(blockSeat) {
    let reserved = 0;
    const {seats} = this.state;
    if (blockSeat && blockSeat.length) {
      for (let i = 0; i < blockSeat.length; i++) {
        if (blockSeat[i].hasOwnProperty('takenTime')) {
          reserved++;
        }
      }
    }

    if (seats && seats.length > 0) {
      reserved += seats.length;
    }
    this.setState({
      ReservedSeat: reserved,
      //     availableSeat: this.state.availableSeat,
      reserved: reserved,
    });

    return reserved;
  };

  async commonSeatCheckFun(dataPass) {
    const {productslug} = this.props;
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "product/details",
      "POST",
      false,
      undefined,
      {
        productSlug: productslug,
        userId: this.props.userState.id || false
      }
    );
    if (result.data && result.data.data && result.data.data.blockSeat) {
      this.decalculation(result.data.data.blockSeat)
      this.setState({
        blockSeat: result.data.data.blockSeat,
        availableSeat: result.data.data.remainingQuantity
      })
    }

    //let reserved = this.decalculation(result.data.data.blockSeat);


    if (result.isError) {
      this.setState({
        displayInactiveProduct: true
      });
    } else {

      if (result.data.data.isActive) {
        if (dataPass === "handleLogin") {
          this.setState({
            showLoginModel: true,
            displayInactiveProduct: false
          });
        }
        if (dataPass === "displaySeatModel") {
          this.setState({
            displayWebinarModel: true,
            displayInactiveProduct: false
          });
        }
      } else {
        this.setState({
          displayInactiveProduct: true
        });
      }
    }
  }


  checkDuplicateInObject = (propertyName, inputArray, respObj) => {
    var seenDuplicate = false,
      testObject = {};
    let tempObj = {};
    if (inputArray) {
      inputArray.map(item => {
        if (item) {
          if (propertyName === "seatNumber")
            var itemPropertyName = item[propertyName];
          else
            itemPropertyName = item[propertyName] && item[propertyName].trimAllSpace().toLowerCase();
          if (itemPropertyName in testObject) {
            testObject[itemPropertyName].duplicate = true;
            item.duplicate = true;
            seenDuplicate = true;
            tempObj = item;
          } else {
            testObject[itemPropertyName] = item;
            delete item.duplicate;
          }
        }
        return true;
      });
      if (!respObj) {
        return seenDuplicate;
      }
      return {
        isDup: seenDuplicate,
        item: tempObj
      };
    }

    return true;
  }

  async handleAddToCart(id) {
    this.setState({
      selectRewardPoint: false,
      rewardInDollor: 0,
      discount: 0,
      promoCode: ""
    });
    this.setState({
      uniqueNameErrorClass: "display_none",
      uniqueNameErrorMsg: ""
    });

    await this.calculateCost('one');

    let flag = false;
    const {errors} = this.state;
    var seenDuplicate = false;
    const {productDetails} = this.props;
    const {productData} = productDetails;
    this.state.seats.map((seat, index) => {
      if (seat.userName.trim() === "") {
        errors[index] = "Name Is Required";
        this.setState({errors});
        flag = true;
      } else if (seat.userName.trim().split(' ').length < 2) {
        errors[index] = "Please enter a valid first and last name";
        this.setState({errors});
        flag = true;
      } else {
        errors[index] = "";
        this.setState({errors});
      }
      return true;
    });
    if (flag) {
      return;
    }
    const seats = this.state.seats.concat(this.state.blockSeat);
    seenDuplicate = this.checkDuplicateInObject("userName", this.state.seats);
    if (seenDuplicate) {
      this.setState({
        uniqueNameErrorClass: "",
        uniqueNameErrorMsg: "Name can not be same, use different name"
      });
      return;
    }
    const dup = this.checkDuplicateInObject("userName", seats, true);
    if (dup.isDup) {
      this.setState({
        uniqueNameErrorClass: "",
        uniqueNameErrorMsg: `${
          dup.item.userName
          } is already taken for this webinar`
      });
      return;
    }
    let seenDuplicateSeat = this.checkDuplicateInObject("seatNumber", seats);
    if (seenDuplicateSeat) {
      this.setState({
        uniqueNameErrorClass: "",
        uniqueNameErrorMsg: "Seat is already been taken."
      });
      return;
    }
    this.setState({
      displayWebinarModel: false,
      displayConfirmation: true
    });
  }

  openPaymentForm = () => {
    this.setState({
      payment: {
        ...this.state.payment,
        openModal: true
      },
      displayWebinarModel: false,
      displayConfirmation: false
    });
  };

  confirmationText = () => {
    let string = "";
    for (let index = 0; index < this.state.seats.length; index++) {
      const seat = this.state.seats[index];
      string += `${seat.seatNumber} - ${seat.userName}`;
    }
    return string;
  };

  handleModel = () => {
    const {productDetails} = this.props;
    const {productData} = productDetails;
    const {blockSeat} = this.state;
    const blockedSeats = blockSeat || productData.blockSeat;
    this.setState(
      {
        displayWebinarModel: !this.state.displayWebinarModel,
        errorMessage: '',
        seats: [],
        errors: '',
        uniqueNameErrorMsg: '',
        uniqueNameErrorClass: "display_none",
      }
    );

    let reserved = this.decalculation(blockedSeats);

    /**
     * after close modal icon with seats select remove all user reservations in this product
     **/

  };


  handleChange = (index, seatNumber, e) => {
    let seats = this.state.seats;
    seats[index].userName = e.target.value;
    this.setState({seats: seats});
  };

  handleSeats = (seatNumber) => {
    this.setState({
      errors: []
    })
    const {firstName, lastName, id: userId} = this.props.userState;
    let id = "seat_" + seatNumber;
    let seat = seatNumber;
    let data = {
      seatNumber: seat,
      userName: "",
      userId: userId
    };
    const userName = [firstName, lastName].join(" ").trim();
    if (this.state.seats.findIndex(i => i.seatNumber === seat) > -1) {
      document.getElementById(id).classList.remove("selectedSeat");
      document.getElementById(id).classList.add("availableSeat");
      this.setState({
        seats: this.state.seats.filter(res => res.seatNumber !== seat),
        reserved: this.state.reserved - 1,
        availableSeat: this.state.availableSeat + 1,
        ReservedSeat: this.state.ReservedSeat - 1
      });
    } else {
      document.getElementById(id).classList.remove("availableSeat");
      document.getElementById(id).classList.add("selectedSeat");
      let d;
      if (this.state.seats.length) {
        d = this.state.seats.concat(data);
      } else {
        d = this.state.seats.concat({...data, userName: userName});
      }
      this.setState({
        seats: d,
        reserved: this.state.reserved + 1,
        availableSeat: this.state.availableSeat - 1,
        ReservedSeat: this.state.ReservedSeat + 1
      });
    }
  };

  closePaymentModal = async () => {
    await this.refreshData();
    this.setState({
      payment: {
        ...this.state.payment,
        openModal: false
      },
      //seats: [],
      displayConfirmation: true
    });
    //this.displaySeatModel()
  };

  paymentData = async paymentData => {
    this.setState({
      payment: {
        ...this.state.payment,
        errorAuth: false,
        errorMessage: "",
        loaderDisplay: true
      }
    });
    const {seats, discount, promoCode} = this.state;
    const {productDetails} = this.props;
    const {productData} = productDetails;

    let addressData = {
      country: this.state.countrySelected,
      address: this.state.address,
      address2: this.state.address2,
      city: this.state.citySelected,
      state: this.state.stateSelected,
      postalCode: this.state.postalCode
    }
    let api = new ApiHelper();
    let resultdata = "";
    resultdata = await api.FetchFromServer(
      "/order",
      "/webinar",
      "POST",
      true,
      undefined,
      {
        shippingAddress: '',
        notes: this.state.note,
        shipStatus: this.state.shippingAddress,
        paymentType: "authorized",
        productId: productData.id,
        quantity: seats.length,
        webinarDetails: seats,
        discount: discount,
        coupan: discount ? promoCode || "" : "",
        cardData: paymentData,
        billingAddress: addressData,
        useRewardPoints: this.state.selectRewardPoint,
        rewardPoint: this.state.rewardPoint,
        giftCardCodeApplied: this.state.giftCardInDollor ? this.state.arGiftCard || "" : "",
        redeemGiftCardPrice: this.state.giftCardInDollor
      }
    );
    if (resultdata.isError) {
      //ToastStore.error(resultdata.messages[0]);
      this.setState({
          payment: {
            ...this.state.payment,
            errorAuth: true,
            errorMessage: resultdata.messages[0],
            loaderDisplay: false
          }
        },
        () => {
          setTimeout(() => {
            this.setState({
              payment: {
                ...this.state.payment,
                errorAuth: false,
                errorMessage: "",
                loaderDisplay: false
              }
            });
          }, 5000);
        }
      );
    } else {
      const {history} = this.props;
      if (resultdata.data.data) {
        history.push({
          pathname: "/payment-success/" + resultdata.data.id
        });
      } else {
        window.location.reload()
      }

      ToastStore.success("Payment Successful");
    }


  };

  eventHandler = (e) => {
    //console.log(e.target.name + " " + e.target.value);
    this.setState({[e.target.name]: e.target.value});
  };

  async changeCity(e) {
    this.setState({citySelected: e.target.value});
  }

  async changeState(e) {
    this.setState({stateSelected: e.target.value});
  }

  errorHandler = () => {
    setTimeout(() => {
      this.setState({
        isSubmitted: false
      });
    }, 3000);
  };

  async confirmPayment() {
    const {match} = this.props;
    const {seats} = this.state;
    const {params} = match;
    const {productslug} = params;
    let error = false;

    this.setState({isSubmitted: true});

    if (this.state.address === '') {
      console.log('error6');
      error = true
    }
    if (this.state.citySelected === '') {
      console.log('error5');
      error = true
    }
    var billingCityRegex = this.state.citySelected.match(/^[a-zA-Z.][a-zA-Z.\s]*$/);
    if (!billingCityRegex) {
      error = true
    }
    if (this.state.stateSelected === '') {
      this.setState({
        disabled: true
      });
      error = true
    }
    if (this.state.postalCode === '') {
      error = true
    }

    if (!this.state.acceptButton) {
      error = true
    }

    if (error) {
      this.errorHandler();
      return;
    }

    let api = new ApiHelper();

    let result = await api.FetchFromServer(
      "/",
      "product/details",
      "POST",
      false,
      undefined,
      {
        productSlug: productslug,
        seats,
        userId: this.props.userState.id || false
      }
    );

    if (result.isError) {

      if (Array.isArray(result.messages) && ~result.messages.indexOf('Some seats are already taken')) {

        let errorMessage = 'Some seats are already taken'
        if (result.errorData && result.errorData.alreadyTakenSeats && result.errorData.alreadyTakenSeats.length > 0) {
          errorMessage = `${errorMessage}: ${result.errorData.alreadyTakenSeats.map(s => s.seatNumber).join(', ')}`
        }
        this.setState({errorMessage});
      } else {
        this.setState({productDeactive: true});
      }
    } else {
      let dataReturn = result.data.data;

      const index = this.state.seats.findIndex(bs => bs.seatNumber > dataReturn.productQuantity);
      if (dataReturn.isActive && index === -1) {
        this.setState({
          displayConfirmation: false,
          displayWebinarModel: false,
          payment: {
            ...this.state.payment,
            openModal: true,
            availableTo: dataReturn.availableTo
          },
          availableSeat: dataReturn.remainingQuantity
        });
      } else {
        this.setState({
          productDeactive: true
        });
      }
      this.decalculation(dataReturn.blockSeat)
      /**
       * save user data method
       */
      this.saveUserData().catch((e) => console.log(e));
    }
  }

  async saveUserData() {
    const {countrySelected, address, address2, citySelected, stateSelected, postalCode} = this.state;

    let addressData = {
      country: countrySelected,
      address: address,
      address2: address2,
      city: citySelected,
      state: stateSelected,
      postalCode: postalCode
    }
    const api = new ApiHelper();
    await api.FetchFromServer(
      "/",
      "user/partialUpdateProfile",
      "PUT",
      true,
      undefined,
      addressData
    );
  }

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
  }

  calculateCost = async (type, selectRewardPointNow) => {

    const {giftCard, promoCode, selectRewardPoint, seats, arGiftCard} = this.state;

    let {productDetails} = this.props;
    let result = null;

    let arGiftCardNew = arGiftCard;

    if (giftCard) {
      arGiftCardNew.push(giftCard)
    }

    if (type === 'one') {
      result = await new ApiHelper().FetchFromServer('/', 'userCart/calculateCost', 'POST', true, undefined, {
        giftCardCode: [],
        promoCode: 0,
        selectRewardPoint: false,
        products: productDetails.productData,
        seats,
        type: 'digital'
      });
      this.setState({
        rewardInDollor: result.data.data.rewardPointInDollar.toFixed(2),
        discount: (result.data.data.coupanDiscount).toFixed(2),
        giftCardInDollor: result.data.data.redeemGiftCardPrice,
        arGiftCardComplit: result.data.data.arGiftCardCodeInt,
        arGiftCard: []
      });
    } else {
      result = await new ApiHelper().FetchFromServer('/', 'userCart/calculateCost', 'POST', true, undefined, {
        giftCardCode: giftCard,
        arGiftCardCode: arGiftCardNew,
        promoCode: promoCode,
        selectRewardPoint: (type === 'point') ? selectRewardPointNow : selectRewardPoint,
        products: productDetails.productData,
        seats,
        type: 'digital'
      });
    }

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
        rewardInDollor: data.rewardPointInDollar.toFixed(2),
        giftCardInDollor: data.redeemGiftCardPrice,
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
        arGiftCardNew = []
        for (let i in data.arGiftCardCodeInt.code) {
          const complGift = data.arGiftCardCodeInt.code[i]
          arGiftCardNew.push(complGift.giftcard);
        }
      }

      this.setState({
        discount: (data.coupanDiscount).toFixed(2),
        rewardInDollor: data.rewardPointInDollar.toFixed(2),
        giftCardInDollor: data.redeemGiftCardPrice,
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
        giftCard: '',
        arGiftCardComplit: data.arGiftCardCodeInt,
      });
    }

    this.setState({newTotal: data.newTotalAmount.toFixed(2)})

  }

  isSelectCode = (code) => {
    let {arGiftCardComplit} = this.state;
    if (arGiftCardComplit.len > 0) {
      for (const i in  arGiftCardComplit.code) {
        const selectCode = arGiftCardComplit.code[i].giftcard
        if (selectCode === code) {
          return true
        }
      }
    }

    return false
  }

  removeCart = (code) => {
    const {arGiftCard} = this.state;
    let newArGiftCard = []
    if (arGiftCard && arGiftCard.length > 0) {
      for (let i in arGiftCard) {
        if (arGiftCard[i] !== code) {
          newArGiftCard.push(arGiftCard[i])
        }
      }
    }

    this.state.arGiftCard = newArGiftCard

    this.calculateCost('gift');
  }

  responseGoogle = (response) => {
    const {location} = this.props;
    const {pathname} = location;
    //let returnUrl = qs.parse(pathname);
    let data = {
      googleData: response,
      returnUrl: pathname
    }
    this.props.googleLoginAction(data);
  }

  showCodeList = () => {
    const {showCodeList} = this.state
    this.setState(
      {
        showCodeList: (!showCodeList)
      }
    )
  }

  setSelectCode = (e) => {
    if (e.target.value && e.target.value !== '0') {
      this.setState({
        giftCard: e.target.value,
        showCodeList: false
      })
    }
  }

  setInfoUser = () => {
    const {userState} = this.props;
    const {address, address2, citySelected, stateSelected, postalCode} = this.state;

    if (
      (!address && userState.address)
      || (!address2 && userState.address2)
      || (!citySelected && userState.city)
      || (!stateSelected && userState.state)
      || (!postalCode && userState.postalCode)
    ) {

      this.setState({
        address: userState.address || "",
        address2: userState.address2 || "",
        citySelected: userState.city || "",
        stateSelected: userState.state || "",
        postalCode: userState.postalCode || "",
        updateInfo: true
      });
    }
  }

  goToCatalog = () => {
    const {
      history,
      productDetails,
    } = this.props;
    const location = history.location;
    const queryParams = qs.parse(location.search || '');
    const productData = productDetails.productData;
    const status = productData.status;

    if (!queryParams.status) {
      queryParams.status = status;
    }

      history.push(`${getWebinarsLink()}?${qs.stringify(queryParams)}`);
  };

  render() {
    const {productDetails, userState} = this.props;
    const {productData} = productDetails;
    const numberOfSeat = productData.productQuantity;
    const {loginState} = this.props;
    const cartDisable = this.state.seats.length ? false : true;
    const {blockSeat, newTotal, showCodeList} = this.state;
    const blockedSeats = blockSeat || productData.blockSeat
    let seatsList = [];
    let TooltipTitle = "";
    const totalAmount = (newTotal) ? newTotal : (this.state.seats.length * productData.productPrice).toFixed(2);

    const {catalog, errorMessage, updateInfo, arGiftCardComplit} = this.state;

    if (!updateInfo) {

      this.setInfoUser()
    }


    for (let i = 0; i < numberOfSeat / 10; i++) {
      let children = [];
      //    let children = [],
      // rowIndex = String.fromCharCode(65 + i);
      //Inner loop to create children
      for (let j = i * 10 + 1; j <= i * 10 + 10 && j <= numberOfSeat; j++) {
        var seatClass = "";
        if (blockedSeats) {
          const bArr = blockedSeats.filter(
            res => res.seatNumber === j
          );

          if (bArr.length) {
            if (bArr[0].hasOwnProperty('takenTime')) {
              seatClass = "temporaryBlockedSeat";
              TooltipTitle = "Reserved";
            } else {
              seatClass = "blockedSeat";
              TooltipTitle = "Blocked"
            }


            children.push(
              <div className="seatI" key={j}>
                <span id={"seat_" + j} className={seatClass}>
                    {
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={["tooltip", Math.random()].join("_")}>
                            {TooltipTitle}
                          </Tooltip>
                        }
                      >
                        <span>{j}</span>
                      </OverlayTrigger>
                    }
                </span>
              </div>
            );
          } else {
            const index = this.state.seats.findIndex(
              res => res.seatNumber === j
            );
            const isSelected = index > -1;
            children.push(
              <div className="seatI" key={j}>
                                <span
                                  id={"seat_" + j}
                                  className={isSelected ? "selectedSeat" : "availableSeat"}
                                  onClick={e => this.handleSeats(j)}
                                >
                                  {j}
                                </span>
              </div>
            );
          }
        } else {

          const index = this.state.seats.findIndex(
            res => res.seatNumber === [j]
          );
          const isSelected = index > -1;
          children.push(
            <div className="seatI" key={j}>
              <span
                id={"seat_" + j}
                className={isSelected ? "selectedSeat" : "availableSeat"}
                onClick={e => this.handleSeats(j)}
              >
                {j}
              </span>
            </div>
          );
        }
      }
      //Create the parent and add the children
      seatsList.push(
        <tr key={i}>
          {/* <td>
            <div className="seatR Setrow">{rowIndex}</div>
          </td> */}
          <td className="SRow1">{children}</td>
        </tr>
      );
    }
    return (
      <div>
        <nav className="breadcrumb">
          <ul>
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <a onClick={this.goToCatalog}>
                {" "}
                {"Catalog"}{" "}
              </a>
            </li>
            <li>{productData.productName}</li>
          </ul>
        </nav>
        <div className="row">
          <div className="col-sm-12 product-detail-content">
            <div className="product-type product-block">
              <div className="product-gallery product-gallery-col">
                <div className="image-holder-zoom">
                  {
                    productData.productImage
                    && (
                      // <TransformWrapper style={{width:"100%"}} >
                       <TransformWrapper 
                        style={{width:"100%"}}
                        defaultScale={1}
                        pan={{disabled:!this.state.isZoomMode, animationTime:1, paddingSize:0}}
                        // positionX={!this.state.isZoomMode?0:"auto"}
                        // scalePadding={{disabled:!this.state.isZoomMode}}
                        onZoomChange={(zoom)=>{
                          const isZoomMode = zoom.scale>1;
                          if (this.state.isZoomMode != isZoomMode) {
                            if (isZoomMode)
                              this.setState({isZoomMode})
                            else {
                              setTimeout(()=>{
                                this.setState({isZoomMode})
                              },1000)
                            }
                          }
                        }}
                      >
                          <TransformComponent>
                            <img  src={AppConfig.cdn + productData.productImage} alt="webinar" />
                          </TransformComponent>
                      </TransformWrapper>
                      // <Magnifier
                      //   src={AppConfig.cdn + productData.productImage}
                      //   mgShape={'square'}
                      // />
                    )
                  }
                  {
                    !productData.productImage && !!Object.keys(productData).length && (
                      <img src="/assets/img/img-dld-placeholder.jpg" alt=""/>
                    )
                  }
                </div>
              </div>
              <div className="product-summary product-summary-col">
                <h1 className="product-title">{productData.productName}</h1>
                <p className="price">
                  <span className="Price-amount price-left">
                    <span><font className="price-currencysymbol">$</font>
                      {productData.productPrice
                        ? productData.productPrice
                        : null}</span>
                  </span>
                </p>
                {
                  productData.shortDescription === "" ?
                    null :
                    <div className="product-details-short-description">
                      <p dangerouslySetInnerHTML={{__html: productData.shortDescription}}></p>
                    </div>
                }
                {loginState.isLoggedIn ? (
                  productData.isActive ? (
                    <button
                      type="submit"
                      className="add-cart-btn btn-effect one"
                      onClick={this.displaySeatModel.bind(this, productData.id)}
                    >
                      Book your seats
                    </button>
                  ) : (
                    <div className="productDeactivate">Product is deactivated or removed</div>
                  )
                ) : (
                  <button
                    className="btn-effect one checkout-btn"
                    onClick={this.handleLogin}
                  >
                    Login To Book seats
                  </button>
                )}

                {this.state.showLoginModel ? (
                  <AuthModel
                    displayLoginModel={this.state.showLoginModel}
                    displayLoginTrigger={this.displayLoginTrigger}
                    loginFun={this.loginFun}
                    registratioFun={this.registrationFun}
                    status={"webinar"}
                    responseGoogle={this.responseGoogle}
                  />
                ) : (
                  ""
                )}
                <div className="product-meta">
                  <div className="sku-wrapper">
                    Type :<span className="sku">Webinar</span>
                  </div>
                  <div className="posted-in">
                    Categories :
                    <span>
                      {productData.category ? (
                        <Link
                          to={
                            getWebinarsLink()+ "?categories=" + productData.category.id
                          }
                        >
                          {productData.category
                            ? productData.category.categoryName
                            : "N/A"}
                        </Link>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                  <div className="sku-wrapper">
                    Views Remaining:
                    <span className="sku">{productData.remainingQuantity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Modal
            show={this.state.displayWebinarModel}
            onHide={this.handleModel}
            className="seatsmodal"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">
                <div className="screenEye">
                  <img
                    src={Constant.frontUrl + "/assets/img/webinarscreen.svg"}
                    alt=""
                    width="50px"
                  />
                  <span>Where would you like to sit?</span>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="webina-ticket-wrapper clearfix">
                <div className="webina-ticket-hall">
                  <div className="webinar-seats-wrap">
                    <div className="webinar-seats-inner">
                      <div className="webinar-seatsOverflow">
                        <table
                          align="center"
                          cellSpacing="0"
                          cellPadding="0"
                          className="setmain"
                        >
                          <tbody>{seatsList}</tbody>
                        </table>
                      </div>
                      <div className="seatsInfo">
                        <ul className="seatsInfo-list">
                          <li>
                            <div className="seatsInfo-block">
                              <span className="colorbox available"/>
                              <span>Available</span>
                            </div>
                          </li>
                          <li>
                            <div className="seatsInfo-block">
                              <span className="colorbox selected"/>
                              <span>Selected</span>
                            </div>
                          </li>
                          <li>
                            <div className="seatsInfo-block">
                              <span className="colorbox reservation"/>
                              <span>Reserved</span>
                            </div>
                          </li>
                          <li>
                            <div className="seatsInfo-block">
                              <span className="colorbox blocked"/>
                              <span>Blocked</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="seatsQtyInfo">
                        <ul className="seatsQtyInfo-list">
                          <li>
                            <div className="seatsQtyInfo-block">
                              <span className="text">Total Seats :</span>
                              <span>{numberOfSeat}</span>
                            </div>
                          </li>
                          <li>
                            <div className="seatsQtyInfo-block">
                              <span className="text">Available Seats :</span>
                              <span>{this.state.availableSeat}</span>
                            </div>
                          </li>
                          <li>
                            <div className="seatsQtyInfo-block">
                              <span className="text">Reserved Seats :</span>
                              <span>{this.state.ReservedSeat}</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="webinarUserinfo-wrap clearfix">
                  {this.state.seats.length ? (
                    <div>
                      <h4>Fill out viewer information</h4>
                      <p
                        className={
                          "uniqueNameError " + this.state.uniqueNameErrorClass
                        }
                      >
                        {this.state.uniqueNameErrorMsg}
                      </p>
                      <div className="webinarUserinfo-Inner">
                        <form id="webinarInfoUser">
                          {this.state.seats.map((seat, index) => {
                            return (
                              <div className="form-group" key={index}>
                                <div className="webinarUserinfo-tile">
                                  <div className="imgField">
                                    <img
                                      src={
                                        Constant.frontUrl +
                                        "/assets/img/chair.svg"
                                      }
                                      alt=""
                                      width="50px"
                                    />
                                    <div>{seat.seatNumber}</div>
                                  </div>
                                  <div className="inputField">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="Name"
                                      name="userName"
                                      placeholder="Enter Full Name"
                                      value={seat.userName}
                                      onChange={this.handleChange.bind(
                                        this,
                                        index,
                                        seat.seatNumber
                                      )}
                                    />
                                    <div className="text-danger">
                                      {this.state.errors[index]}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </form>
                      </div>
                    </div>
                  ) : (
                    <h4>Please Select seats for webinar</h4>
                  )}
                  <div className="text-center margin15">
                    <button
                      className="add-cart-btn btn-effect one"
                      onClick={this.handleAddToCart.bind(this, productData.id)}
                      disabled={cartDisable}
                    >
                      Book your seats
                    </button>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          <AuthorizeForm
            displayAuthModel={this.state.payment.openModal}
            cardTotal={totalAmount}
            availableTo={this.state.payment.availableTo}
            paymentFunction={this.paymentData}
            closeAuthFunction={this.closePaymentModal}
            errorMessage={this.state.payment.errorMessage}
            errorAuth={this.state.payment.errorAuth}
            loaderDisplay={this.state.payment.loaderDisplay}
            backBtn={true}
          />
          <Modal
            show={this.state.displayConfirmation}
            onHide={() => {
              this.setState({
                displayConfirmation: false,
                displayWebinarModel: true
              });
            }}
            className="seatsmodal"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">
                <div className="screenEye">
                  <img
                    src={Constant.frontUrl + "/assets/img/webinarscreen.svg"}
                    alt=""
                    width="50px"
                  />
                  <span>Seat Confirmation</span>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="webina-ticket-wrapper clearfix">
                <div className="webina-ticket-bill">
                  <div className="webina-ticket-overflow">
                    <table className={"table table-bordered"}>
                      <thead>
                      <tr>
                        <th>Seat No.</th>
                        <th>Viewer Name</th>
                      </tr>
                      </thead>
                      <tbody>
                      {this.state.seats.map((seat, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <div className="imgField">
                                <img
                                  src={
                                    Constant.frontUrl +
                                    "/assets/img/chair.svg"
                                  }
                                  alt=""
                                  width="26px"
                                />
                                <div>{seat.seatNumber}</div>
                              </div>
                            </td>
                            <td>{seat.userName}</td>
                          </tr>
                        );
                      })}
                      </tbody>
                    </table>
                    {errorMessage && (
                      <div className="error-text margin-bottom30">
                        {errorMessage}
                      </div>
                    )}
                  </div>

                  <div className="webinarAmountTotalFooter">
                    <div className="webinarPromo">
                      <div className="promo-webinar checkout-accodion-option">
                        <div className="cart-coupon-wrap">
                          <h4>Choose any one of them</h4>

                          {(userState.rewardPoint) > 0 ? (
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
                                    {userState.rewardPoint} Points
                                  </span>
                                  </div>
                                </AccordionItemBody>
                              </AccordionItem>
                            </Accordion>
                          ) : null}
                          <Accordion>
                            <AccordionItem>
                              <AccordionItemTitle>
                                <h3 className="u-position-relative">
                                  Add Promo Code
                                  <div className="acc_icon" role="presentation"/>
                                </h3>
                              </AccordionItemTitle>
                              <AccordionItemBody>
                                <div className="form-group">
                                  <input
                                    type={"text"}
                                    placeholder={"Have a promo code?"}
                                    className={"form-control promo-code"}
                                    value={this.state.promoCode}
                                    onChange={e => {
                                      this.setState({promoCode: e.target.value});
                                    }}
                                  />
                                  {
                                    this.state.disableCoupan ?
                                      <button
                                        className={"btn-effect one apply-btn"}
                                        disabled
                                      >
                                        Apply
                                      </button>
                                      :
                                      <button
                                        className={"btn-effect one apply-btn"}
                                        onClick={() => {
                                          this.calculateCost('cupon')
                                        }}
                                      >
                                        Apply
                                      </button>
                                  }
                                </div>
                              </AccordionItemBody>
                            </AccordionItem>
                          </Accordion>
                          {(productData.category.slug !== 'vip')
                            ? (
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
                                            class="remove-link cursor-point"><i class="fa fa-trash"
                                                                                aria-hidden="true"></i> Remove</span>
                                          </div>
                                        })

                                      ) : null
                                    }

                                    <div className="form-group">
                                      <input
                                        type={"text"}
                                        placeholder="Have a gift card?"
                                        className="form-control coupon-code"
                                        value={this.state.giftCard}
                                        onChange={e => {
                                          this.setState({giftCard: (e.target.value).trim()});
                                        }}
                                      />
                                      {(showCodeList && userState && userState.code) ?
                                        (<select size="5" className="codeList"
                                                 onChange={this.setSelectCode}>
                                          <option value="0">Choose your code</option>
                                          {userState.code &&
                                          userState.code.map((item, index) => {
                                            if (!this.isSelectCode(item.giftCardCode)) {
                                              return <option value={item.giftCardCode}>{item.giftCardCode}</option>
                                            }
                                          })
                                          }

                                        </select>)
                                        : null

                                      }

                                      {(userState && userState.code) ?
                                        (<button
                                          className={"btn-effect one apply-btn list-code-btn"}
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
                                      {
                                        this.state.isApplyDisableGiftCard ?
                                          <button
                                            className={"btn-effect one apply-btn"}
                                            disabled
                                          >
                                            Apply
                                          </button>
                                          :
                                          <button
                                            className={"btn-effect one apply-btn"}
                                            onClick={() => {
                                              this.calculateCost('gift')
                                            }}
                                          >
                                            Apply
                                          </button>
                                      }
                                    </div>
                                  </AccordionItemBody>
                                </AccordionItem>
                              </Accordion>
                            )
                            : <span><em>Gift cards cannot be used on Intro webinars</em></span>
                          }

                        </div>
                      </div>
                    </div>

                    <table className={"table webinarAmountTotal webinarPage"}>
                      <tbody>

                      <tr>
                        <td colSpan={2} className={"amtPay"}>
                          <span>Total Amount : </span>
                        </td>
                        <td className={"webseatpay"}>
                          <span className="font-roboto">$</span>
                          {(this.state.seats.length * productData.productPrice).toFixed(2)}
                        </td>
                      </tr>

                      {
                        this.state.discount ? (
                          <tr>
                            <td colSpan={2} className={"amtPay"}>
                              <span>Discount : </span>
                            </td>
                            <td className={"webseatpay"}>
                              <span className="font-roboto">- $</span>
                              {this.state.discount}
                            </td>
                          </tr>
                        ) : null

                      }

                      {
                        this.state.selectRewardPoint ?
                          (<tr>
                            <td colSpan={2} className={"amtPay"}>
                              <span>Reward Amount : </span>
                            </td>
                            <td className={"webseatpay"}>
                              <span className="font-roboto">- $</span>
                              {this.state.rewardInDollor}
                            </td>
                          </tr>) :
                          null
                      }

                      {
                        this.state.giftCardInDollor ?
                          (<tr>
                            <td colSpan={2} className={"amtPay"}>
                              <span>Gift Card Amount : </span>
                            </td>
                            <td className={"webseatpay"}>
                              <span className="font-roboto">- $</span>
                              {this.state.giftCardInDollor}
                            </td>
                          </tr>) :
                          null
                      }
                      <tr className={"webinarPagePay"}>
                        <td colSpan={2} className={"amtPay"}>
                          <span>Amount to Pay : </span>
                        </td>
                        <td className={"webseatpay"}>
                          <span className="font-roboto">$</span>
                          {totalAmount}
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="webinar-billing-form">
                    <div className="billing-address-inner">
                      <h4 className="heading"><span>Billing Information</span></h4>
                    </div>
                    <form id="billingForm">
                      <div className="form-bill-wrap">
                        <div className="form-group">
                          <input
                            type="text"
                            name="address"
                            className="form-control"
                            id=""
                            maxLength="80"
                            onChange={this.eventHandler}
                            placeholder="Address"
                            value={this.state.address}
                          />
                          {this.state.isSubmitted && this.state.address === '' ? (
                            <p className={'text-danger-checkout'}>
                              Please enter address
                            </p>
                          ) : null}
                        </div>
                        <div className="row">
                          <div className="form-group col-md-6">
                            <input
                              type="text"
                              name="address2"
                              className="form-control"
                              onChange={this.eventHandler}
                              id=""
                              maxLength="30"
                              placeholder="Suite/Apt"
                              value={this.state.address2}
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <input
                              type="text"
                              name="city"
                              className="form-control"
                              maxLength="50"
                              onChange={this.changeCity.bind(this)}
                              id=""
                              placeholder="City"
                              value={this.state.citySelected}
                            />
                            {this.state.isSubmitted && this.state.citySelected.trim() === '' ? (
                              <p className={'text-danger-checkout'}>Please enter city</p>
                            ) : this.state.isSubmitted && !this.state.citySelected.match(/^[a-zA-Z.][a-zA-Z.\s]*$/) ? (
                              <p className={'text-danger-checkout'}>City name is
                                incorrect</p>
                            ) : null}
                          </div>
                        </div>
                        <div className="row">
                          <div className="form-group col-md-6">
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
                              <p className={'text-danger-checkout'}>Please select
                                state</p>
                            ) : null}
                          </div>
                          <div className="form-group col-md-6">
                            <input
                              type="text"
                              name="postalCode"
                              className="form-control"
                              id=""
                              maxLength="30"
                              placeholder="Postal Code"
                              onChange={this.eventHandler}
                              value={this.state.postalCode}
                            />
                            {this.state.isSubmitted && this.state.postalCode === '' ? (
                              <p className={'text-danger-checkout'}>
                                Please enter postal code
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="webinarPayFooter">
                    <div className="termsPage">
                      <input type="checkbox" onChange={this.setAcceptButtonValue}
                             value={this.state.acceptButton}
                             checked={this.state.acceptButton}/>&nbsp;
                      <span> I agree with the <Link to="/terms-and-condition"
                                                    target="_blank">terms and conditions</Link> </span>
                    </div>
                    {this.state.isSubmitted && !this.state.acceptButton ? (
                      <p className={'text-danger'}>Please accept the terms & conditions</p>
                    ) : null}
                    <button
                      className={"btn-effect one shopping-btn"}
                      onClick={() => {
                        this.setState({
                          displayConfirmation: false,
                          displayWebinarModel: true
                        });
                      }}
                    >
                      No, Want to change
                    </button>
                    {
                      this.state.productDeactive ?
                        <span>
                          <button
                            className={"btn-orange one"}
                            disabled
                          >
                            Yes, Confirm it
                        </button>
                          <p className="productDeactivate">Product is deactivated or removed</p>
                        </span>
                        :
                        <button
                          className={"btn-orange one"}
                          onClick={this.confirmPayment.bind(this)}
                        >
                          Yes, Confirm it
                        </button>
                    }
                  </div>

                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }
}

// class ImageZoomComponent extends Component {
//   render() {
//     const props = this.props.propsVal;
//     return <ReactImageZoom {...props} />;
//   }
// }

const mapStateToProps = state => {
  return {
    loginState: state.loginReducer,
    userState: state.profileInfoReducer.profileInfo
  };
};
const mapDispatchProps = dispatch => {
  return {
    loginUser: userData => {
      dispatch(loginCartRequest(userData));
    },
    signUpUser: userData => {
      dispatch(signUpCartRequest(userData));
    },
    webinarCheckOut: data => {
      dispatch(webinarCheckOutInfoRequest(data));
    },
    googleLoginAction: (data) => {
      dispatch(glloginRequest(data));
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchProps
)(withRouter(WebinarDetailPage));
