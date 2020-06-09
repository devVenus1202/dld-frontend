import React, { PureComponent } from "react";
import { Modal } from "react-bootstrap";
import { InfiniteLoader } from "../Common/Loader/Loader";
import {AppConfig} from "../../../config/AppConfig";
class ProductOrderDetails extends PureComponent {
  render() {
    const {
      isLoading,
      title,
      isOpen,
      onHide,
      orderDetails,
      giftcardorderdetails,
      total,
      tax,
      grossAmount,
      currentItem
    } = this.props;
    let discount = this.props.discount;
    if (!discount) {
      discount = 0;
    }
    let shippingCharge = this.props.shippingCharge;
    if (!shippingCharge) {
      shippingCharge = 0;
    }


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
              <span>Product Details for Order Number {title}</span>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <InfiniteLoader />
          ) : (
              <div className="webina-ticket-wrapper clearfix">
                <div className="webina-ticket-bill">
                  <div className="webina-ticket-overflow">
                    <table className={"table table-bordered"}>
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Description</th>
                          <th>Delivery</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails &&
                          orderDetails.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <div className="litle-img ">
                                    <img
                                      alt=""
                                      src={AppConfig.cdn + item.product.smallImageThumbnail}
                                      onError={e => {
                                        e.target.onError = null;
                                        e.target.src =
                                          "/assets/img/img-dld-placeholder.jpg";
                                      }}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="product-name">
                                    {item.product.productName}
                                  </div>
                                  <div className="product-info">
                                    <span>
                                      <b>Price:</b>
                                    </span>{" "}
                                    ${item.currentPrice}
                                  </div>
                                  <div className="product-info">
                                    <span>
                                      <b>Quantity:</b>
                                    </span>{" "}
                                    {item.quantity}
                                  </div>
                                  <div className="product-info">
                                    <span>
                                      <b>Category :</b>
                                    </span>{" "}
                                    {item.product.category.categoryName}
                                  </div>
                                </td>
                                <td>
                                  {(item.trackingNumbers && item.trackingNumbers.length > 0) ? <div>
                                    <span>Tracking Number #{item.trackingNumbers[0].shippingNumber}</span>
                                    <br/>
                                    <span>Status: {item.trackingNumbers[0].shippingStatus}</span>
                                  </div> : <span>-</span>}
                                </td>
                                <td>${item.subTotal}</td>
                              </tr>
                            );
                          })}
                        {giftcardorderdetails &&
                        giftcardorderdetails.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <div className="litle-img">
                                            <img
                                                alt=""
                                                src={AppConfig.cdn + item.giftcard.smallImageThumbnail}
                                                onError={e => {
                                                    e.target.onError = null;
                                                    e.target.src =
                                                        "/assets/img/gift-placeholder.jpg";
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="product-name">
                                            {item.giftcard.title}
                                        </div>
                                        <div className="product-info">
                                    <span>
                                      <b>Price:</b>
                                    </span>{" "}
                                            ${item.currentPrice}
                                        </div>
                                        <div className="product-info">
                                    <span>
                                      <b>Quantity:</b>
                                    </span>{" "}
                                            {item.quantity}
                                        </div>
                                        <div className="product-info">
                                    <span>
                                      <b>Type :</b>
                                    </span>{" "}
                                            {"Gift Card"}
                                        </div>
                                    </td>
                                    <td></td>
                                    <td>${item.subTotal}</td>
                                </tr>
                            );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="webinarAmountTotalFooter">
                    {
                      currentItem.rewardPointInDollar || currentItem.rewardPointInDollar !== 0 ?
                        <div className="text-right">Reward Point Used:&nbsp;
                              {currentItem.rewardPoint ? currentItem.rewardPoint : 0}</div>
                        : null
                    }
                    <table className={"table webinarAmountTotal"}>
                      <tbody>
                        <tr>
                          <td colSpan={3}>

                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2} className={"amtPay"}>
                            <span>Subtotal  : </span>
                          </td>
                          <td className={"webseatpay"}>
                            <span className="font-roboto">$</span>
                            {grossAmount}
                          </td>
                        </tr>

                        {
                          currentItem.rewardPointInDollar || currentItem.rewardPointInDollar !== 0 ?
                            <tr>
                              <td colSpan={2} className={"amtPay"}>Reward Amount</td>
                              <td className={"webseatpay"}>
                                <span className="font-roboto">- $</span>
                                {currentItem.rewardPointInDollar ? currentItem.rewardPointInDollar : 0}
                              </td>
                            </tr>
                            : null}
                        {
                          currentItem.redeemGiftCardPrice || currentItem.redeemGiftCardPrice !== 0 ?
                            <tr>
                              <td colSpan={2} className={"amtPay"}>Gift Card Amount</td>
                              <td className={"webseatpay"}>
                                <span className="font-roboto">- $</span>
                                {currentItem.redeemGiftCardPrice ? currentItem.redeemGiftCardPrice : 0}
                              </td>
                            </tr>
                            : null}

                        {discount ? (
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

                        {
                          shippingCharge ? (
                            <tr>
                              <td colSpan={2} className={"amtPay"}>
                                <span>Shipping : </span>
                              </td>
                              <td className={"webseatpay"}>
                                <span className="font-roboto">+ $</span>
                                {shippingCharge}
                              </td>
                            </tr>
                          ) : null}
                        {currentItem.tax ? (
                        <tr>
                            <td colSpan={2} className={"amtPay"}>
                                <span>Tax : </span>
                            </td>
                            <td className={"webseatpay"}>
                                <span className="font-roboto">+ $</span>
                                {currentItem.tax}
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
                              total ? total : 0
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          {/* <div className="webinarPayFooter">
            <button className={"btn-effect one shopping-btn"} onClick={onHide}>
              Close
            </button>
          </div> */}
        </Modal.Body>
      </Modal>
    );
  }
}

export default ProductOrderDetails;
