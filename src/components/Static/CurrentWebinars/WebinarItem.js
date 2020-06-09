import React, {Component} from 'react';
import _ from 'lodash';
import {WEBINAR_STATE_UPCOMING, WEBINAR_STATE_ONGOING, WEBINAR_STATE_COMPLETED, ORDER_STATUS_REFUND} from "../../../constants";
import Constant from "../../../config/Constant";

export default class WebinarItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            upComing: false,
            onGoing: false,
        }
    }

    handleOpenProductDetails = () => {
        const {
            item,
            openProductDetails,
        } = this.props;

        openProductDetails(item);
    };

    render() {
        const {
            item,
            openProductDetails,
        } = this.props;
        const productName = _.get(item, 'orderdetails[0].product.productName') || 'N/A';
        const webinarState = _.get(item, 'orderdetails[0].product.webinarState') || 'N/A';
        const categoryName = _.get(item, 'orderdetails[0].product.category.categoryName') || 'N/A';
        const webinarUrl = _.get(item, 'orderdetails[0].product.webinarUrl');
        const remainingQuantity = _.get(item, 'orderdetails[0].product.remainingQuantity');
        const orderStatus = _.get(item, 'orderStatus');
        const notes = _.get(item, 'notes');
        let Status;

        switch (+webinarState) {
            case WEBINAR_STATE_UPCOMING:
                Status = (<span className="webinar-upcoming">Upcoming</span>);
                break;

            case WEBINAR_STATE_ONGOING:
                Status = (<span className="webinar-ongoing">Ongoing</span>);
                break;

            case WEBINAR_STATE_COMPLETED:
                Status = (<span className="webinar-completed">Completed</span>);
                break;

            default: break;
        }

        let additionalData = null;

        if (orderStatus === ORDER_STATUS_REFUND) {
            additionalData = (
                <p>Refunded</p>
            );
        } else if (+remainingQuantity === 0 && webinarState === WEBINAR_STATE_UPCOMING ) {
            additionalData = (
                <p>Sold Out {(notes) ? '(Partial refund)' : null}</p>
            );
        } else if (webinarUrl) {
            additionalData = (
                <p>
                    <a href={webinarUrl}>
                        <img
                            alt="view"
                            src={Constant.frontUrl + "/assets/img/icons/link-icon.svg"}
                            width="20px"
                        />View Link {(notes) ? '(Partial refund)' : null}</a>
                    &nbsp;
                </p>
            );
        } else if (notes) {
            additionalData = (
                <p>Partial refund</p>
            );
        }
        
        return (
            <tr>
                <td>{productName}</td>
                <td>{Status}</td>
                <td>
                    <p className="webinar-category">{categoryName}</p>
                </td>
                <td>
                    <div className="webinar-actions">
                        {additionalData}
                        <button
                            onClick={this.handleOpenProductDetails}
                            className="webinar-view-icon"
                        >
                            <img alt="view" src={Constant.frontUrl + "/assets/img/icons/view-icon.svg"} width="20px"/>
                        </button>
                    </div>
                </td>
            </tr>
        )
    }
};
