import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {AppConfig} from "../../../config/AppConfig";
import {getProductsLink} from "../../../helpers/links";

// import { ToastStore } from "react-toasts";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
        }
    }

    removefromCart(productId, count, type) {
        // console.log(productId, count, type);
        // return;
        const data = {productId: productId, count: count, type: type};
        this.props.deleteCart(data);
    }

    handleMinus(productId, quantity, activeStatus, type) {
        let countNew = parseInt(quantity) - 1;
        if (countNew > 0 && activeStatus)
            this.props.changeQuantity(productId, countNew, type);
    }

    handleAdd = (productId, quantity, remainingQuantity, index, activeStatus, type) => {
        const {errors} = this.state;
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
            this.props.changeQuantity(productId, countNew, type);
    }

    render() {
        const {cartData} = this.props;
        return (
            <div className="table-wrap" id="scrollabledesign">
                <table className="table shop-table">
                    <tbody>
                    {
                        cartData && cartData.cartProduct.length ?
                            cartData.cartProduct.map((item, index) => {
                                let redirectLink;
                                let redirectCategoryLink;
                                if (item.type === "giftcard") {
                                    redirectLink = "/gift-card/" + item.giftcard.giftcardSlug;
                                    redirectCategoryLink = "";
                                }
                                if (item.type === "physical") {
                                    redirectLink = "/"+item.product.status+"/" + item.product.productSlug;
                                    redirectCategoryLink = `/${getProductsLink()}?categories=${item.product.category.id}`;
                                }

                                if (item.type === "physical") {
                                    return <CartPhysicalList
                                        key={index}
                                        item={item}
                                        redirectLink={redirectLink}
                                        redirectCategoryLink={redirectCategoryLink}
                                        index={index}
                                        errors={this.state.errors}
                                        removefromCart={this.removefromCart.bind(this)}
                                        handleMinus={this.handleMinus.bind(this)}
                                        handleAdd={this.handleAdd}
                                    />
                                }
                                if (item.type === "giftcard") {
                                    return <CartGiftList
                                        key={index}
                                        item={item}
                                        redirectLink={redirectLink}
                                        redirectCategoryLink={redirectCategoryLink}
                                        index={index}
                                        errors={this.state.errors}
                                        removefromCart={this.removefromCart.bind(this)}
                                        handleMinus={this.handleMinus.bind(this)}
                                        handleAdd={this.handleAdd}
                                    />
                                }

                                return true;
                            }) :
                            null
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}

class CartGiftList extends Component {

    removefromCart(productId, count) {
        this.props.removefromCart(productId, count, "giftcard");
    }

    handleMinus(productId, quantity, activeStatus) {
        this.props.handleMinus(productId, quantity, activeStatus, "giftcard");
    }

    handleAdd = (productId, quantity, remainingQuantity, index, activeStatus) => {
        this.props.handleAdd(productId, quantity, remainingQuantity, index, activeStatus, "giftcard");
    }

    render() {
        const {item, redirectLink, index, errors} = this.props;
        const img = (item.giftcard.smallImageThumbnail) ? AppConfig.cdn + item.giftcard.smallImageThumbnail: '/assets/img/gift-placeholder.jpg'
        return (
            <tr className="cart-item" key={index}>
                <td className="product-thumbnail">
                    <Link target="_blank"
                          to={redirectLink}
                          className="link-product">
                        <div className="cart-thumbnail">
                            <img alt="..." src={img} className="cart-image"/>
                        </div>
                    </Link>
                </td>
                <td className="product-name">

                    <Link target="_blank" to={redirectLink} className="text-link">{item.giftcard.title}</Link>
                    <div className="cart-cat">Type :
                        <span>Gift Card</span>
                    </div>

                </td>
                <td className="acctulproduct-price">
                    <span className="price-amount"><span><span className="currency-icon">$</span>{item.giftcard.giftcardPrice}</span></span>
                    {
                        item.giftcard.isActive ?
                            null
                            :
                            <div className="errorCart text-danger">
                                <span>Product Is Not Available</span>
                            </div>
                    }
                </td>
                <td className="product-quantity">
                    <div className="quantity">
                        <div className="control">
                            <span className="btn-number qtyminus quantity-minus"
                                  onClick={this.handleMinus.bind(this, item.giftcard.id, item.quantity, item.giftcard.isActive)}>-</span>
                            <input type="text" data-step="1" value={item.quantity} data-min="0" data-max=""
                                   name="cartqty" className="input-qty qty" size="4" readOnly/>
                            <span className="btn-number qtyplus quantity-plus"
                                  onClick={this.handleAdd.bind(this, item.giftcard.id, item.quantity, item.giftcard.remainingQuantity, index, item.giftcard.isActive)}>+</span>
                        </div>

                    </div>
                    <span className="errorCart text-danger">{errors[index]}</span>
                </td>
                <td className="product-price">
                    <span className="price-amount">
                        <span>
                            <span className="currency-icon">$</span>{(item.giftcard.giftcardPrice * item.quantity).toFixed(2)}
                        </span>
                    </span>
                    <div className="">
                        <span className="remove-link cursor-point"
                              onClick={this.removefromCart.bind(this, item.giftcard.id, item.quantity)}><i
                            className="fa fa-trash" aria-hidden="true"></i> Remove</span>
                    </div>
                </td>
            </tr>
        )
    }
}

class CartPhysicalList extends Component {
    removefromCart(productId, count) {
        this.props.removefromCart(productId, count, "physical");
    }

    handleMinus(productId, quantity, activeStatus) {
        this.props.handleMinus(productId, quantity, activeStatus, "physical");
    }

    handleAdd = (productId, quantity, remainingQuantity, index, activeStatus) => {
        this.props.handleAdd(productId, quantity, remainingQuantity, index, activeStatus, "physical");
    }

    render() {
        const {item, redirectLink, redirectCategoryLink, index, errors} = this.props;
        return (
            <tr className="cart-item" key={index}>
                <td className="product-thumbnail">
                    <Link target="_blank"
                          to={redirectLink}
                          className="link-product">
                        <div className="cart-thumbnail">
                            <img alt="" src={(item.product.smallImageThumbnail)
                                ? AppConfig.cdn + item.product.smallImageThumbnail
                                : (item.product.productImage) ? AppConfig.cdn + item.product.productImage : '/assets/img/img-dld-placeholder.jpg'} className="cart-image" />
                        </div>
                    </Link>
                </td>
                <td className="product-name">
                    <Link target="_blank" to={redirectLink} className="text-link">{item.product.productName}</Link>
                    {item.category !== null ?
                        <div className="cart-cat">Categories :
                            <span>
								<Link to={redirectCategoryLink}>{item.product.category.categoryName}</Link>
							</span>
                        </div>
                        : null}
                    <div className="cart-cat">Type :
                        <span>Physical</span>
                    </div>
                </td>
                <td className="acctulproduct-price">
                    <span className="price-amount"><span><span className="currency-icon">$</span>{item.product.productPrice}</span></span>
                    {
                        item.product.isActive ?
                            null
                            :
                            <div className="errorCart text-danger">
                                <span>Product Is Not Available</span>
                            </div>
                    }
                </td>
                <td className="product-quantity">
                    <div className="quantity">
                        <div className="control">
                            <span className="btn-number qtyminus quantity-minus"
                                  onClick={this.handleMinus.bind(this, item.product.id, item.quantity, item.product.isActive)}>-</span>
                            <input type="text" data-step="1" value={item.quantity} data-min="0" data-max=""
                                   name="cartqty" className="input-qty qty" size="4" readOnly/>
                            <span className="btn-number qtyplus quantity-plus"
                                  onClick={this.handleAdd.bind(this, item.product.id, item.quantity, item.product.remainingQuantity, index, item.product.isActive)}>+</span>
                        </div>

                    </div>
                    <span className="errorCart text-danger">{errors[index]}</span>
                </td>
                <td className="product-price">
                    <span className="price-amount">
                        <span>
                            <span className="currency-icon">$</span>{(item.product.productPrice * item.quantity).toFixed(2)}
                        </span>
                    </span>
                    <div className="">
                        <span className="remove-link cursor-point"
                              onClick={this.removefromCart.bind(this, item.product.id, item.quantity)}><i
                            className="fa fa-trash" aria-hidden="true"></i> Remove</span>
                    </div>
                </td>
            </tr>
        )
    }
}

export default Cart;
