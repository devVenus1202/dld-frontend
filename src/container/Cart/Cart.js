import React, {Component} from "react";
import {connect} from "react-redux";
import {
    cartListWithLoginRequest, cartListWithoutLoginRequest, cartListWithoutLoginSuccess, glloginRequest,
    loginCartRequest,
    signUpCartRequest
} from "../../actions";
import CartPageWithLogin from "../../components/Static/Cart/CartPageWithLogin";
import PaymentBlock from "./../../components/Static/Cart/PaymentBlock";
import deleteStorageFunction from "./DeleteCart";
import AuthModel from "../../components/Static/Common/AuthModel/AuthModel";
import Loader from "../../components/Static/Common/Loader/Loader";
import {ToastStore} from "react-toasts";
import {ApiHelper} from "../../helpers/ApiHelper";
import localStorageFunction from "../../container/ProductDetail/LocalCart";
import NoCart from "../../components/Static/Common/NoCart";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoginModel: false,
            displaySubmitButton: true,
            login: false,
        };
    }
    
    async componentWillMount() {
        const storageSession = JSON.parse(localStorage.getItem("localStorageVal"));
        if (storageSession) {
            this.state.login = true;
            this.props.cartDataWithLogin();
        } else {
            this.props.cartData();
        }
    }
    
    arraysEqual(a, b) {
        if (a instanceof Array && b instanceof Array) {
            if (a.length !== b.length) // assert same length
                return false;
            for (var i = 0; i < a.length; i++) // assert each element equal
                if (!this.arraysEqual(a[i], b[i]))
                    return false;
            return true;
        } else {
            return a === b; // if not both arrays, should be the same
        }
    }
    
    async deleteCart(data) {
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
            if (result.isError) {
                ToastStore.error(result.messages[0]);
                return;
            }
            this.props.cartDataWithLogin();
        } else {
            deleteStorageFunction(data);
            this.props.cartData();
        }
    }
    
    handleShow = () => {
        this.setState({showLoginModel: true});
    };
    
    handleHide = () => {
        this.setState({showLoginModel: false});
    };
    
    displayLoginTrigger = displayStatus => {
        this.setState({showLoginModel: displayStatus});
    };
    
    loginFun = data => {
        this.props.loginUser(data);
    };
    
    registrationFun = data => {
        this.props.signUpUser(data);
    };
    
    async changeQuantity(productId, countNew, type) {
        const {cartData, cartDataWithLogin} = this.props;
        const storageSession = JSON.parse(localStorage.getItem("localStorageVal"));
        if (storageSession) {
            let dataValue = {
                productId: productId,
                quantity: countNew,
                type: type
            };
            let api = new ApiHelper();
            let result = await api.FetchFromServer(
                "/",
                "userCart",
                "POST",
                true,
                undefined,
                dataValue
            );
            if (result.isError) {
                //ToastStore.error(result.messages[0]);
                return;
            }
            cartDataWithLogin();
        } else {
            let dataValue = {
                productId: productId,
                count: countNew
            };
            localStorageFunction(dataValue);
            cartData();
        }
    }
    
    responseGoogle = (response) => {
        let returnUrl = "/checkout";
        let data = {
            googleData: response,
            returnUrl
        }
        this.props.googleLoginAction(data);
    }
    
    render() {
        
        const {cartDataState, loginState, openAuthPopupWithGuestOption} = this.props;
        const {login} = this.state;
        
        if (!login && loginState.isLoggedIn) {
            return null
        }
        
        return (
                <section className="cart-page minHight container">
                    <nav className="breadcrumb">
                        <ul>
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>Cart</li>
                        </ul>
                    </nav>
                    <div className="row">
                        <div className="col-sm-12 cat-product">
                            <div className="cart-holder-table">
                                {
                                    cartDataState.isLoading ? <Loader/> :
                                        cartDataState.cartProduct.product || cartDataState.cartProduct.length ? (
                                            <div>
                                                <CartPageWithLogin
                                                    cartData={cartDataState}
                                                    deleteCart={this.deleteCart.bind(this)}
                                                    loginState={loginState}
                                                    changeQuantity={this.changeQuantity.bind(this)}
                                                />
                                                <PaymentBlock
                                                    showLoginModel={this.displayLoginTrigger}
                                                    cartData={cartDataState}
                                                    loginState={loginState}
                                                    openAuthPopupWithGuestOption={openAuthPopupWithGuestOption}
                                                />
                                                <AuthModel
                                                    displayLoginModel={this.state.showLoginModel}
                                                    displayLoginTrigger={this.displayLoginTrigger}
                                                    loginFun={this.loginFun}
                                                    registratioFun={this.registrationFun}
                                                    responseGoogle={this.responseGoogle}
                                                />
                                            </div>
                                        ) : (
                                            <NoCart/>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                </section>
            );
    }
}

const mapStateToProps = state => {
    return {
        cartDataState: state.cartListWithoutLoginReducer,
        loginState: state.loginReducer
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
        cartData: () => {
            dispatch(cartListWithoutLoginRequest());
        },
        cartDataWithLogin: () => {
            dispatch(cartListWithLoginRequest());
        },
        googleLoginAction: (data) => {
            dispatch(glloginRequest(data));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchProps
)(Cart);
