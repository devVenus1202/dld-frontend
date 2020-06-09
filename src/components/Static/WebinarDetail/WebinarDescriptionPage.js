import React, {Component} from 'react';
import {Tabs, Tab} from "react-bootstrap";
import ProductComments from "../ProductDetail/ProductComments";

class WebinarDescriptionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            rating: 3
        };
    }

    handleSelect = (key) => {
        this.setState({key});
    }

    onStarClick = (star) => {
        this.setState({rating: star});
    }

    render() {
        const {productDetails, profileInfo, openLoginPopup, isLoggedIn} = this.props;
        const {productData} = productDetails;

        return (
            <div className="tabs-details-wrap">
                <div className="row">
                    <div className="col-sm-12">
                        {productData.description ? (
                            <div className="details-item">
                                <h4>Description</h4>
                            <p dangerouslySetInnerHTML={{__html: productData.description || "Description not available"}} />
                            </div>
                            ): null
                        }
                        <h4>Comments</h4>
                        <ProductComments
                            productId={productData.id}
                            productSlug={productData.productSlug}
                            catalog={productData.catalog}
                            profileInfo={profileInfo}
                            openLoginPopup={openLoginPopup}
                            isLoggedIn={isLoggedIn}
                        />
                        {/*<Tabs*/}
                        {/*    activeKey={this.state.key}*/}
                        {/*    onSelect={this.handleSelect}*/}
                        {/*    id="controlled-tab-example"*/}
                        {/*    className="custom-tab-wrap"*/}
                        {/*>*/}
                        {/*    <Tab eventKey={1} title="Description" tabClassName="">*/}
                        {/*        <p dangerouslySetInnerHTML={{__html: productData.description}}></p>*/}
                        {/*    </Tab>*/}
                        {/*    <Tab eventKey={2} title="Comments">*/}
                        {/*        <ProductComments*/}
                        {/*            productId={productData.id}*/}
                        {/*            productSlug={productData.productSlug}*/}
                        {/*            catalog={productData.catalog}*/}
                        {/*            profileInfo={profileInfo}*/}
                        {/*        />*/}
                        {/*    </Tab>*/}
                        {/*</Tabs>*/}
                    </div>
                </div>
            </div>
        )
    }
}


export default WebinarDescriptionPage;
