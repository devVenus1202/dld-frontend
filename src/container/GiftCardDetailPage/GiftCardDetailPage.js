import React, {Component} from "react";
import {connect} from "react-redux";
import {ToastStore} from 'react-toasts';
import GiftCardDetail from "../../components/Static/GiftCardDetail/GiftCardDetail";
import GiftCardDescriptionPage from "../../components/Static/GiftCardDetail/GiftCardDescriptionPage";
import {loginGiftCartRequest, signUpGiftCartRequest, singleGiftProductBySlugRequest} from "../../actions";
import {ApiHelper} from "../../helpers/ApiHelper";
import localStorageFunction from "../ProductDetail/LocalCart";
import AuthModel from "../../components/Static/Common/AuthModel/AuthModel";

class GiftCardDetailPage extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            showLoginModel: false,
            guestData: {}
        }
    }
    
    componentDidMount() {
        const {match} = this.props;
        const {params} = match;
        const {giftCardSlug} = params;
        this.props.productDetail(giftCardSlug);
        let giftCartProductSession = JSON.parse(localStorage.getItem("cartProduct"));
        if (giftCartProductSession) {
        } else {
            var prod = {productCount: 0, product: {}};
            localStorage.setItem("cartProduct", JSON.stringify(prod));
            // localStorage.setItem("giftCartProduct", JSON.stringify(prod));
        }
    }
    
    async addToCart(data) {
        const storageSession = JSON.parse(localStorage.getItem("localStorageVal"));
        if (storageSession) {
            let dataValue = {
                productId: data.productId,
                quantity: data.count,
                customAmount: data.customAmount,
                type: "giftcard"
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
                ToastStore.error(result.messages[0]);
                return;
            } else {
                this.props.history.push("/cart");
            }
        } else {
            this.setState({guestData: data});
            data.type = "giftcard";
            localStorageFunction(data);
            this.props.history.push("/cart");
            // this.displayLoginTrigger();
            
        }
    }
    
    displayLoginTrigger = () => {
        this.setState({showLoginModel: !this.state.showLoginModel});
    }
    
    loginFun = (data) => {
        this.props.giftCartDataWithLogin(data);
    }
    
    registrationFun = (data) => {
        this.props.giftCartDataWithSignup(data);
    }
    
    checkoutRedirectionFun = (data) => {
        localStorageFunction(this.state.guestData);
        this.props.history.push("/gift-checkout");
    }
    
    responseGoogle = (response) => {
        console.log(response);
    }
    
    render() {
        const {singleProductData} = this.props;
        
        return (
            <section className="product-detail-page">
                <div className="container">
                    <GiftCardDetail
                        giftCardDetails={singleProductData}
                        addToCart={this.addToCart.bind(this)}/>
                    <GiftCardDescriptionPage giftCardDetails={singleProductData}/>
                    {/* <ProductDescriptionPage productDetails={singleProductData}
              profileInfo={profileInfo}/> */}
                    <AuthModel
                        displayLoginModel={this.state.showLoginModel}
                        displayLoginTrigger={this.displayLoginTrigger}
                        loginFun={this.loginFun}
                        registratioFun={this.registrationFun}
                        checkoutRedirection={this.checkoutRedirectionFun}
                        giftCardRedirection={true}
                        responseGoogle={this.responseGoogle}
                    />
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return {
        singleProductData: state.singleProductBySlugReducer,
        // loginState: state.loginReducer,
        // profileInfo: state.profileInfoReducer
    };
};

const mapDispatchProps = dispatch => {
    return {
        productDetail: slug => {
            dispatch(singleGiftProductBySlugRequest(slug));
        },
        giftCartDataWithLogin: (userData) => {
            dispatch(loginGiftCartRequest(userData));
        },
        giftCartDataWithSignup: (userData) => {
            dispatch(signUpGiftCartRequest(userData));
        }
    };
};
export default connect(
    mapStateToProps,
    mapDispatchProps
)(GiftCardDetailPage);

