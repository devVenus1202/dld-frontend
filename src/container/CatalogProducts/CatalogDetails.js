import React from "react";
import {connect} from "react-redux";
import _ from 'lodash';
import {productListCleared, redirectTo, singleProductBySlugRequest} from "../../actions";
import {Loader} from "../../components/Static/Common/Loader/Loader";
import ProductDetail from "../../container/ProductDetail/ProductDetail";
import WebinarDetail from "../../container/WebinarDetail/WebinarDetail";

class CatalogDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            productSlug: undefined
        };
        
    }



    componentWillMount() {
        window.scrollTo(0, 0);
        this.runCatalog();
    }

    runCatalog = () => {
        const {productslug: _productslug, match} = this.props;
        const __productslug = match && match.params && match.params.productslug;
        const productslug = _.trim(_productslug) || _.trim(__productslug);
        this.setState({productslug});
        this.props.productDetail(productslug);

    }

    onRattingAdd = () => {
        window.scrollTo(0, 0);
        this.runCatalog();
    }

    render() {
        const {
            productslug
        } = this.state;
        const {singleProductData} = this.props;
        const {productData} = singleProductData;
        return productData ? (
            productData.status === "digital" ? (
                <WebinarDetail {...this.props} productslug={productslug}/>
            ) : productData.status === "physical" ? (
                <ProductDetail {...this.props} onRattingAdd={this.onRattingAdd} productslug={productslug}/>
            ) : (
                <div style={{minHeight: 500}}>
                    <Loader/>
                </div>
            )
        ) : (
            <div>
                <Loader/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        singleProductData: state.singleProductBySlugReducer,
        loginState: state.loginReducer,
        profileInfo: state.profileInfoReducer
    };
};
const mapDispatchProps = dispatch => {
    return {
        redirect: path => {
            dispatch(
                redirectTo({
                    path: path
                })
            );
        },
        productDetail: slug => {
            dispatch(singleProductBySlugRequest(slug));
        },
        clearProductList: () => {
            dispatch(productListCleared())
        },
    };
};
export default connect(
    mapStateToProps,
    mapDispatchProps
)(CatalogDetails);
