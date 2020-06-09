import React, { Component } from "react";
import { withRouter } from "react-router";

class GiftCheckOutWithOutLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
        };
    }


    removefromCart(productId, count) {
        const data = { productId: productId, count: count };
        this.props.onDeleteFun(data);
    }

    handleMinus(productId, quantity, activeStatus) {
        //console.log(productId, quantity, activeStatus);
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
                                    <h4>{item.product.title}</h4>
                                </div>
                                <div className="pro-view-detial">
                                    <div className="categ">Quantity : <span>{item.product.quantity}</span></div>
                                    <div className="categ">Type :<span>Gift Card</span></div>
                                    {
                                        item.product.isActive ?
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
                                        <span className="btn-number qtyminus quantity-minus"
                                            onClick={this.handleMinus.bind(this, item.product.id, item.product.quantity, item.product.isActive)}>-</span>
                                        <input type="text" data-step="1" data-min="1" data-max="" name="quantity" title="Qty" className="input-qty qty" size="4" min="1" max="" value={item.product.quantity} />
                                        <span className="btn-number qtyplus quantity-plus"
                                            onClick={this.handleAdd.bind(this, item.product.id, item.product.quantity, item.product.remainingQuantity, index, item.product.isActive)}>+</span>
                                    </div>
                                </div>
                                <span className="errorCart text-danger">{this.state.errors[index]}</span>
                            </div>
                            <div className="right-block">
                                <div className="bill-price"><span> $ {item.product.sum ? item.product.sum: 0} </span></div>
                                <div className="">
                                    <span className="remove-link cursor-point" onClick={this.removefromCart.bind(this, item.product.id, item.product.quantity)}><i className="fa fa-trash" aria-hidden="true"></i> Remove</span>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>
        );
    }
}


export default withRouter(GiftCheckOutWithOutLogin);
