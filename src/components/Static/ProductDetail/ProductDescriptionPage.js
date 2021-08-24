import React, {Component} from "react";
import {Tabs, Tab} from "react-bootstrap";
import ProductReviewAndRating from "./ProductReviewAndRating";

// import ProductComments from "./ProductComments";
class ProductDetailPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            rating: 3
        };
    }

    handleSelect = key => {
        this.setState({key});
    };

    onStarClick = star => {
        this.setState({rating: star});
    };

    onRattingAddFun = () => {
        this.props.onRattingAdd();
    }

    render() {
        const {productDetails, openLoginPopup, isLoggedIn} = this.props;
        const {productData} = productDetails;
        return (
            <div className="tabs-details-wrap">
                <div className="row">
                    <div className="col-sm-12">
                        {productData.description ?
                            (
                                <div className="details-item">
                                    <h4>Description</h4>
                                        <p dangerouslySetInnerHTML={{__html: productData.description}}/>
                                </div>
                            )
                            : null
                        }
                        <h4>Rating & Reviews</h4>
                        <ProductReviewAndRating
                            productName={productData.productName}
                            productId={productData.id}
                            totalRatings={productDetails.totalRatings || 0}
                            averagRating={productDetails.avgRating || 0}
                            productSlug={productData.productSlug}
                            catalog={productData.catalog}
                            onRattingAdd={this.onRattingAddFun}
                            openLoginPopup={openLoginPopup}
                            isLoggedIn={isLoggedIn}
                        />

                        {/*<Tabs*/}
                        {/*  activeKey={this.state.key}*/}
                        {/*  onSelect={this.handleSelect}*/}
                        {/*  id="controlled-tab-example"*/}
                        {/*  className="custom-tab-wrap"*/}
                        {/*>*/}
                        {/*  <Tab eventKey={1} title="Description" tabClassName="">*/}
                        {/*  <div className="product-descripation-wrap">*/}
                        {/*    { productData.description ? */}
                        {/*    <p dangerouslySetInnerHTML={{ __html: productData.description}}*/}
                        {/*    />*/}
                        {/*    : */}
                        {/*    <div className="notfound">*/}
                        {/*      <p dangerouslySetInnerHTML={{ __html: "Description not available"}}/>*/}
                        {/*    </div>*/}
                        {/*    }*/}
                        {/*  </div>*/}
                        {/*  </Tab>*/}
                        {/*  <Tab eventKey={2} title="Rating & Reviews">*/}
                        {/*    <ProductReviewAndRating*/}
                        {/*      productName={productData.productName}*/}
                        {/*      productId={productData.id}*/}
                        {/*      totalRatings={productDetails.totalRatings || 0}*/}
                        {/*      averagRating={productDetails.avgRating || 0}*/}
                        {/*      productSlug={productData.productSlug}*/}
                        {/*      catalog={productData.catalog}*/}
                        {/*      onRattingAdd={this.onRattingAddFun}*/}
                        {/*    />*/}
                        {/*  </Tab>*/}
                        {/* <Tab eventKey={3} title="Comments">
                <ProductComments
                  productId={productData.id}
                  productSlug={productData.productSlug}
                  catalog={productData.catalog}
                  profileInfo={profileInfo}
                />
              </Tab> */}
                        {/*</Tabs>*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductDetailPage;
