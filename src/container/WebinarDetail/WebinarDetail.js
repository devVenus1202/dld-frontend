import React, {Component} from "react";
import WebinarDetailPage from "../../components/Static/WebinarDetail/WebinarDetailPage";
import WebinarDescriptionPage from "../../components/Static/WebinarDetail/WebinarDescriptionPage";
import localStorageFunction from "./WebinarLocalCart";
import {Loader} from "../../components/Static/Common/Loader/Loader";
import { connect } from "react-redux";

import {
  hideHeader
} from "../../actions";
class WebinarDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        const {setHeaderHide} = this.props;
        setHeaderHide({showHeader:true});
      }
      
    componentDidMount() {
        let cartProductSession = JSON.parse(localStorage.getItem("cartProduct"));
        if (cartProductSession) {
        } else {
            var prod = {productCount: 0, product: {}};
            localStorage.setItem("cartProduct", JSON.stringify(prod));
        }
    }

    addToCart = data => {
        localStorageFunction(data);
    };

    render() {
        const {
            singleProductData,
            loginState,
            productslug,
            profileInfo,
            updateDetail,
            openLoginPopup,
        } = this.props;
        return (
            <section className="product-detail-page">
                <div className="container">
                {singleProductData.isLoading ? (
                    <Loader/>
                ) : singleProductData.productData ? (
                    singleProductData.productData.status === "digital" ? (
                        <div>
                            <WebinarDetailPage
                                productDetails={singleProductData}
                                loginState={loginState.isLoggedIn}
                                addToCart={this.addToCart}
                                productslug={productslug}
                                updateDetail={updateDetail}
                                openLoginPopup={openLoginPopup}
                            />
                            <WebinarDescriptionPage
                                productDetails={singleProductData}
                                profileInfo={profileInfo}
                                openLoginPopup={openLoginPopup}
                                isLoggedIn={loginState.isLoggedIn}
                            />
                        </div>
                    ) : (
                        <div className="minHight"/>
                    )
                ) : null}
                </div>
            </section>
        );
    }
}


const mapStateToProps = state => {
    return {
      showHeader: state.webSettingsReducer.showHeader
    };
  };
  const mapDispatchProps = dispatch => {
    return {
      setHeaderHide: data => {
        dispatch(hideHeader(data));
      }
    };
  };
  
  
  export default connect(
    mapStateToProps,
    mapDispatchProps
  )(WebinarDetail);
  