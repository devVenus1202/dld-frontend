import React, { Component } from "react";
import { withRouter } from "react-router";
// import { AppConfig } from "../../../config/AppConfig";

class GiftCheckOutWithLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
        }
    }

    handleMinus(productId, quantity, activeStatus) {
        let countNew = parseInt(quantity) - 1;
        if (countNew > 0 && activeStatus)
            this.props.changeQuantity(productId, countNew);
    }

    handleAdd = (productId, quantity, remainingQuantity, index, activeStatus) => {

        const { errors } = this.state;
        let countNew = parseInt(quantity) + 1;
        if (countNew > remainingQuantity) {
            errors[index] = "Quantity exceed";
            this.setState({
                errors
            });
            //ToastStore.error("Quantity exceed");			
            return;
        }
        else {
            this.setState({
                errors: []
            });
        }
        if (countNew > 0 && activeStatus)
            this.props.changeQuantity(productId, countNew);
    }

    removefromCart(productId, count) {
        const data = { productId: productId, count: count };
        this.props.onDeleteFun(data);
    }

    render() {
        const { giftCartDataState } = this.props;
        return (
            <div>
                {
                    giftCartDataState.cartProduct.map((item, index) => {
                        return <div key={index} className="shopbilling-cart-block">
                            <div className="left-block">
                                <i className="fa fa-angle-right" aria-hidden="true"></i>
                                <div className="pro-view-tile">
                                    <h4>{item.giftcard.title}</h4>
                                </div>
                                <div className="pro-view-detial">
                                    <div className="categ">Quantity : <span>{item.quantity}</span></div>
                                    <div className="categ">Type :<span>Gift Card</span></div>
                                    {
                                        item.giftcard.isActive ?
                                            null
                                            :
                                            <div className="errorCart text-danger bold margin10">
                                                <span>Gift Card Is Not Available</span>
                                            </div>
                                    }
                                </div>
                            </div>
                            <div className="middle-block">
                                <div className="quantity">
                                    <div className="control">
                                        <span className="btn-number qtyminus quantity-minus" onClick={this.handleMinus.bind(this, item.giftcard.id, item.quantity, item.giftcard.isActive)}>-</span>
                                        <input type="text" data-step="1" data-min="1" data-max="" name="quantity" title="Qty" className="input-qty qty" size="4" min="1" max="" value={item.quantity} />
                                        <span className="btn-number qtyplus quantity-plus" onClick={this.handleAdd.bind(this, item.giftcard.id, item.quantity, item.giftcard.remainingQuantity, index, item.giftcard.isActive)}>+</span>
                                    </div>
                                </div>
                                <span className="errorCart text-danger">{this.state.errors[index]}</span>
                            </div>
                            <div className="right-block">
                                <div className="bill-price"><span> $ {item.sum ? item.sum : 0} </span></div>
                                <div className="">
                                    <span className="remove-link cursor-point" onClick={this.removefromCart.bind(this, item.giftcard.id, item.quantity)}><i className="fa fa-trash" aria-hidden="true"></i> Remove</span>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>
        );
    }
}


export default withRouter(GiftCheckOutWithLogin);
