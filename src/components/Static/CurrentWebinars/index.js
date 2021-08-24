import React, {Component} from 'react';
import {withRouter} from "react-router";
import WebinarItem from './WebinarItem';
import _ from "lodash";
import WebinarOrderDetails from "../Profile/WebinarOrderDetails";

class CurrentWebinars extends Component {
    state = {
        isOpen: false,
        detailsTitle: null,
        webinarDetails: [],
        webinarAllDetails: [],
        currentItem: null,
    };

    openProductDetails = (order) => {
        const orderDetails = _.get(order, 'orderdetails');
        let webinarDetails = [];

        try {
            webinarDetails = JSON.parse(orderDetails[0].webinarDetails);
        } catch (error) {
            console.log(error);
        }

        this.setState({
            isOpen: true,
            detailsTitle: orderDetails[0] ? orderDetails[0].product.productName : '----',
            webinarDetails: webinarDetails,
            webinarAllDetails: order,
            currentItem: order,
        });
    };

    renderItems = () => {
        const { webinars } = this.props;

        return webinars.map(w => {
            return (
                <WebinarItem
                    key={w.id}
                    item={w}
                    openProductDetails={this.openProductDetails}
                />
            );
        });
    };

    handleRedirectToWebinars = () => {
        const { history } = this.props;

        history.push('/my-webinars');
    };

    render() {
        const {
            isOpen,
            detailsTitle,
            webinarDetails,
            webinarAllDetails,
            currentItem,
        } = this.state;

        return (
            <div className="current-webinars-container">
                <h3>Current Webinars Activity</h3>
                <div className="webinars-content">
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Category</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>{this.renderItems()}</tbody>
                    </table>
                </div>
                <div className="more-btn" onClick={this.handleRedirectToWebinars}>View more</div>
                <WebinarOrderDetails
                    isOpen={isOpen}
                    isLoading={false}
                    title={detailsTitle}
                    onHide={() => {
                        this.setState({
                            isOpen: false,
                            detailsTitle: null,
                            webinarDetails: [],
                            webinarAllDetails: [],
                            currentItem: null,
                        });
                    }}
                    webinarDetails={webinarDetails}
                    orderDetailsData={webinarAllDetails}
                    currentItem={currentItem}
                    type={"webinar"}
                />
            </div>
        )
    }
};

export default withRouter(CurrentWebinars);
