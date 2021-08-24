import React, { Component } from "react";
import { withRouter } from "react-router";
import { ToastStore } from "react-toasts";
import { ApiHelper } from '../../../helpers/ApiHelper';
import AuthorizeForm from '../../../container/Checkout/AuthorizeForm';
class GiftCheckOutForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            contactNumber: "",
            email: "",
            stateSelected: '',
            countrySelected: '231',
            citySelected: '',
            postalCode: '',
            address: '',
            address2: '',
            stateData: [],
            hideSubmitButton: false,
            displayAuthModel: false,
            acceptButton: false,
            disabled: false,
            sendToOtherType: false,
            sendToOtherEmail: ''
        };
    }

    async componentDidMount() {
        const storageSession = JSON.parse(localStorage.getItem('localStorageVal'));
        let api = new ApiHelper();
        let data = {
            countryId: this.state.countrySelected,
            stateId: ''
        };
        let resultcity = await api.FetchFromServer('/', 'userCart/state', 'GET', false, data, undefined);
        const stateThis = this;
        if (!resultcity.isError) {
            stateThis.setState({
                stateData: resultcity.data.states
            });
        }
        if (storageSession) {

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
                });
            }
        }
    }

    async changeState(e) {
        this.setState({ stateSelected: e.target.value });
    }

    async changeCity(e) {
        this.setState({ citySelected: e.target.value });
    }

    eventHandler = (e) => {
        if (e.target.name === 'contactNumber') {
            if (isNaN(e.target.value)) {
                return;
            }
        }
        this.setState({ [e.target.name]: e.target.value });
    };

    errorHandler = () => {
        setTimeout(() => {
            this.setState({
                disabled: false,
                isSubmitted: false
            });
        }, 3000);
    };

    setAcceptButtonValue = () => {
        this.setState({ acceptButton: !this.state.acceptButton });
    }

    async submitOrder(e) {
        e.preventDefault();
        let billing_country = this.state.countrySelected;
        let billing_state = this.state.stateSelected;
        let billing_city = this.state.citySelected;

        this.setState({
            country: billing_country,
            state: billing_state,
            city: billing_city,
            isSubmitted: true
        });
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
        var billingCityRegex = billing_city.match(/^[a-zA-Z][a-zA-Z\s]*$/);
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
        if (this.state.sendToOtherType) {
           
            var emailGiftRegex = this.state.sendToOtherEmail.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
            if (this.state.sendToOtherEmail === '') {
                //ToastStore.error("Email is Required");
                this.setState({
                    disabled: true
                });
                this.errorHandler();
                return;
            } else if (!emailGiftRegex) {
                ToastStore.error('Email is invalid');
                this.setState({
                    disabled: true
                });
                this.errorHandler();
                return;
            }   
        }
        this.setState({ displayAuthModel: true });
    }

    async paymentData(paymentData) {
        this.setState({
            errorAuth: false,
            errorMessage: '',
            loaderDisplay: true
        });
        let dataarray = [];
        let cartProductSession = JSON.parse(localStorage.getItem('giftCartProduct'));
        const storageSession = JSON.parse(localStorage.getItem('localStorageVal'));
        let userIs = 'User';
        const { giftCartDataState } = this.props;
        var productArray = [];
        var formatted;
        if (storageSession) {
            let cartData = giftCartDataState.cartProduct;
            let cartLength = cartData.length;
            productArray = [];
            for (let i = 0; i < cartLength; i++) {
                productArray.push(cartData[i].giftcard.id + '-' + cartData[i].quantity);
            }
            productArray.join(',');
            formatted = productArray.join(',');
            dataarray = {
                products: formatted
            };
        } else {
            let cartData = cartProductSession.product;
            let cartLength = cartProductSession.product.length;
            productArray = [];
            for (let i = 0; i < cartLength; i++) {
                productArray.push(cartData[i].productId + '-' + cartData[i].count);
            }
            productArray.join(',');
            formatted = productArray.join(',');
            dataarray = { products: formatted };
            userIs = 'Guest User';
        }
        let api = new ApiHelper();
        var dataProduct = { products: dataarray.products };
        let productDetailCheck = await api.FetchFromServer(
            "/",
            "giftcard/getGiftCartByProductId",
            "GET",
            false,
            dataProduct,
            undefined
        );
        let displaySubmit = false;
        // console.log(productDetailCheck);
        // return;
        if (productDetailCheck.isError) {
            return;
        } else {
            let productArray = productDetailCheck.data.data;

            for (let i = 0; i < productArray.length; i++) {
                if (productArray[i].product.isActive === false) {
                    displaySubmit = true;
                    break;
                }
            }
            if (displaySubmit) {
                this.setState({
                    hideSubmitButton: true,
                });
            } else {
                this.setState({
                    hideSubmitButton: false,
                });
            }
        }


        if (!displaySubmit) {
            let billing_country = this.state.countrySelected;
            let billing_state = this.state.stateSelected;
            let billing_city = this.state.citySelected;

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

            let data = {
                email: this.state.email,
                billingAddress: billing_address,
                paymentType: 'authorized',
                products: dataarray.products,
                cardData: paymentData,
                userStatus: userIs,
                sendToOtherType: this.state.sendToOtherType,
                sendToOtherEmail: this.state.sendToOtherEmail 
            };

            this.submitPropsFun(data);
        }
    }

    async submitPropsFun(data) {
		//console.log(data);
		let resultdata = '';
		const storageSession = JSON.parse(localStorage.getItem('localStorageVal'));
		let api = new ApiHelper();
		
		if (storageSession) {
			resultdata = await api.FetchFromServer('/', 'giftCardOrder', 'POST', true, undefined, data);
		} else {
			resultdata = await api.FetchFromServer('/', 'giftCardOrder', 'POST', false, undefined, data);
		}
		//console.log(resultdata);
		if (resultdata.isError) {

            this.setState({
                loaderDisplay: false,
                errorAuth: true,
                errorMessage: resultdata.messages[0],
            });
		}
		else {
            this.setState({
                loaderDisplay: false
            });
            localStorage.removeItem('giftCartProduct');
            const { history } = this.props;
            history.push({
                pathname: '/giftcard-success/' + resultdata.data.id
            });
		}
	}

    closeAuthFunction = () => {
        this.setState({ displayAuthModel: !this.state.displayAuthModel });
    }

    sendToOther = () => {
        this.setState({ sendToOtherType: !this.state.sendToOtherType });
    }


    render() {
        const { giftCartDataState } = this.props;
        return (
            <div className="row">
                <div className="col-sm-12 billing-address-block">
                    <div className="billing-address-inner clearfix">
                        <h4 className="heading"><span>Billing Address</span></h4>
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
                                            Please enter first name
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
                                        <p className={'text-danger-checkout'}>Please enter last name</p>
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
                                            Please enter contact number
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
                                        <p className={'text-danger-checkout'}>Please enter email</p>
                                    ) : null}
                                </div>
                                <div className="termsPage-checkout">
                                    <input type="checkbox" onChange={this.sendToOther}
                                        value={this.state.sendToOtherType}
                                        checked={this.state.sendToOtherType} />&nbsp;<p> Send to other </p>
                                </div>
                                {
                                    this.state.sendToOtherType ?
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="sendToOtherEmail"
                                                onChange={this.eventHandler}
                                                id="sendToOtherEmail"
                                                placeholder="Other Email Address"
                                                value={this.state.sendToOtherEmail}
                                            />
                                            {this.state.isSubmitted && this.state.sendToOtherEmail.trim() === '' ? (
                                                <p className={'text-danger-checkout'}>Please enter email</p>
                                            ) : null}
                                        </div>
                                        : null
                                }
                                <div className="clearfix"></div>
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
                                        <p className={'text-danger-checkout'}>Please enter address</p>
                                    ) : null}
                                </div>
                                <div className="clearfix"></div>
                                <div className="form-group select-col">
                                    <input
                                        placeholder="Suite/Apt"
                                        className="form-control"
                                        name="address2"
                                        onChange={this.eventHandler}
                                        id=""
                                        value={this.state.address2}
                                    />
                                </div>
                                <div className="form-group city-group select-col">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="city"
                                        id="billing_city"
                                        autoComplete="new-city"
                                        onChange={this.changeCity.bind(this)}
                                        placeholder="City"
                                        value={this.state.citySelected}
                                    />
                                    {this.state.isSubmitted && this.state.citySelected.trim() === '' ? (
                                        <p className={'text-danger-checkout'}>Please enter city</p>
                                    ) : null}
                                </div>
                                <div className="clearfix"></div>
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
                                        <p className={'text-danger-checkout'}>Please select state</p>
                                    ) : null}
                                </div>
                                <div className="form-group select-col">
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
                                            Please enter postal code
														</p>
                                    ) : null}
                                </div>
                                <div className="clearfix"></div>
                                <div className="termsPage-checkout">
                                    <input type="checkbox"
                                        onChange={this.setAcceptButtonValue}
                                        value={this.state.acceptButton}
                                        checked={this.state.acceptButton} />&nbsp;<span> I agree with the <a target="_blank" href="/terms-and-condition">terms and conditions</a> </span>
                                </div>
                                {this.state.isSubmitted && !this.state.acceptButton ? (
                                    <p className={'text-danger'}>Please accept the terms & conditions                                    </p>
                                ) : null}
                                <div className="form-group">
                                    {this.state.hideSubmitButton ? (
                                        <span>
                                            <button
                                                className="btn-orange one"
                                                onClick={this.submitOrder.bind(this)}
                                                disabled={this.state.disabled}
                                            >
                                                Continue to Payment
											</button>
                                            <p className="errorCart text-danger checkoutCatLink">
                                                Refresh Page, some gift card is
                                                not available
											</p>
                                        </span>
                                    ) : (
                                            <button
                                                className="btn-orange one"
                                                onClick={this.submitOrder.bind(this)}
                                                disabled={this.state.disabled}
                                            >
                                                Continue to Payment
											</button>
                                        )}

                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <br />
                <AuthorizeForm
                    displayAuthModel={this.state.displayAuthModel}
                    cardTotal={
                        giftCartDataState.total ? giftCartDataState.total : 0
                    }
                    paymentFunction={this.paymentData.bind(this)}
                    closeAuthFunction={this.closeAuthFunction}
                    errorMessage={this.state.errorMessage}
                    errorAuth={this.state.errorAuth}
                    loaderDisplay={this.state.loaderDisplay}
                />
            </div>
        );
    }
}


export default withRouter(GiftCheckOutForm);
