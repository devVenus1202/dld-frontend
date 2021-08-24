import React, {PureComponent} from "react";
import {Modal} from "react-bootstrap";
import {InfiniteLoader} from "../Common/Loader/Loader";
import Constant from "../../../config/Constant";

class WebinarOrderDetails extends PureComponent {
    render() {
        let {
            isLoading,
            title,
            isOpen,
            onHide,
            webinarDetails,
            orderDetailsData,
            type
        } = this.props;
        
        let product = null;
       
        
        if (orderDetailsData == null) return ('');
        
        const refundSeats = (orderDetailsData.notes) ? JSON.parse(orderDetailsData.notes) : false
        
        if (refundSeats.length > 0 ) {
            webinarDetails = webinarDetails.concat(refundSeats)
        }
        
        if (type === 'webinar') {
            product = orderDetailsData;
        } else {
            product = (orderDetailsData.hasOwnProperty('product')) ? orderDetailsData.product : null
        }
        
        if (product == null) return ('');
        
        let discount = Number(product.coupanDiscount);
    
        let total = product.totalAmount;
        if (!total) {
            total = 0;
        }
        
        let subTotal = product.grossAmount;
        if (!subTotal) {
            subTotal = 0;
        }
        
        let rewardData = product.rewardPointInDollar;
        if (!rewardData) {
            rewardData = 0;
        }
        
        let giftCardData = product.redeemGiftCardPrice;
        if (!giftCardData) {
            giftCardData = 0;
        }
    
        console.log(webinarDetails);
        return (
            <Modal
                bsSize="large"
                aria-labelledby="contained-modal-title-lg"
                show={isOpen}
                onHide={onHide}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">
                        <div className="screenEye">
                            <img
                                src={Constant.frontUrl + "/assets/img/webinarscreen.svg"}
                                alt=""
                                width="50px"
                            />
                            <span>Sitting Positions for {title}</span>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? (
                        <InfiniteLoader/>
                    ) : (
                        <div className="webina-ticket-wrapper clearfix">
                            <div className="webina-ticket-bill">
                                <div className="webina-ticket-overflow">
                                    <table className={"table table-bordered"}>
                                        <thead>
                                        <tr>
                                            <th width="100px">Serial No.</th>
                                            <th>Seat No.</th>
                                            <th>Username</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {webinarDetails &&
                                        webinarDetails.map((seat, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
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
                                                            <div>
                                                                {seat.seatNumber}
                                                                {(seat.time) ? (' (refund)') : ''}
                                                                </div>
                                                        </div>
                                                    </td>
                                                    <td>{seat.userName}</td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="webinarAmountTotalFooter">
                                    <table className={"table webinarAmountTotal"}>
                                        <tbody>
                                        
                                        <tr>
                                            <td colSpan={2} className={"amtPay"}>
                                                <span>Subtotal  :</span>
                                            </td>
                                            <td className={"webseatpay"}>
                                                <span className="font-roboto">$</span>
                                                {
                                                    subTotal
                                                }
                                            </td>
                                        </tr>
                                        
                                        {discount > 0 ? (
                                            <tr>
                                                <td colSpan={2} className={"amtPay"}>
                                                    <span>Discount : </span>
                                                </td>
                                                <td className={"webseatpay"}>
                                                    <span className="font-roboto">- $</span>
                                                    {discount}
                                                </td>
                                            </tr>
                                        ) : null}
                                        
                                        {rewardData ? (
                                            <tr>
                                                <td colSpan={2} className={"amtPay"}>
                                                    <span>Reward Amount : </span>
                                                </td>
                                                <td className={"webseatpay"}>
                                                    <span className="font-roboto">- $</span>
                                                    {rewardData}
                                                </td>
                                            </tr>
                                        ) : null}
                                        
                                        {giftCardData ? (
                                            <tr>
                                                <td colSpan={2} className={"amtPay"}>
                                                    <span>Gift Card Amount : </span>
                                                </td>
                                                <td className={"webseatpay"}>
                                                    <span className="font-roboto">- $</span>
                                                    {giftCardData.toFixed(2)}
                                                </td>
                                            </tr>
                                        ) : null}
                                        <tr>
                                            <td colSpan={2} className={"amtPay"}>
                                                <span>Amount Paid : </span>
                                            </td>
                                            <td className={"webseatpay"}>
                                                <span className="font-roboto">$</span>
                                                {
                                                    total
                                                }
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                {/* <Modal.Footer>
          <div className="webinarPayFooter">
            <button className={"btn-effect one shopping-btn"} onClick={onHide}>
              Close
            </button>
          </div>
        </Modal.Footer> */}
            </Modal>
        );
    }
}

export default WebinarOrderDetails;
