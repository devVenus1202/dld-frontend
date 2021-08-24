import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { AppConfig } from "../../../config/AppConfig";
import {getProperCatalogLink} from "../../../helpers/links";

class Cart extends Component {

	constructor(props) {
		super(props);
		this.state = {
			errors: [],
		}
	}

	removefromCart(productId, count, type) {
		const data = { productId: productId, count: count, type: type };
		this.props.deleteCart(data);
	}

	handleMinus(productId, quantity, activeStatus, type) {
		let countNew = parseInt(quantity) - 1;
		if (countNew > 0 && activeStatus)
			this.props.changeQuantity(productId, countNew, type);
	}

	handleAdd = (productId, quantity, remainingQuantity, index, activeStatus, type) => {
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
			this.props.changeQuantity(productId, countNew, type);
	}


	render() {
		const { cartData } = this.props;

        return (
			<div className="table-wrap" id="scrollabledesign">
				<table className="table shop-table" >
					<tbody>
						{
							cartData ?
								cartData.map((item, index) => {
									let redirectLink;
									let redirectCategoryLink;
									if (item.type === "giftcard") {
										redirectLink = "/gift-card/" + item.giftcardSlug;
										redirectCategoryLink = "";
									}
									else {
											redirectLink = "/"+item.status+"/" + item.productSlug;
											redirectCategoryLink = `${getProperCatalogLink(item.status)}?categories=${item.category.id}`;
									}

									if (item.type === "giftcard") {
										return <CartWithOutLoginGiftList
											item = {item}
											redirectLink = {redirectLink}
											index={index}
											errors={this.state.errors}
											removefromCart = {this.removefromCart.bind(this)}
											handleMinus = {this.handleMinus.bind(this)}
											handleAdd = {this.handleAdd}/>
									}
									else {
                                        return <tr className="cart-item" key={index}>
											<td className="product-thumbnail">
												<Link target="_blank" to={redirectLink} className="link-product" >
													<div className="cart-thumbnail">
														<img alt="" src={(item.smallImageThumbnail)
                                                            ? AppConfig.cdn + item.smallImageThumbnail
                                                            : (item.productImage) ? AppConfig.cdn + item.productImage : '/assets/img/img-dld-placeholder.jpg'} className="cart-image" />
													</div>
												</Link>
											</td>
											<td className="product-name">
												<Link target="_blank" to={redirectLink} className="text-link">{item.productName}</Link>
												{item.tegory !== null ?
													<div className="cart-cat">Categories :
												<span>
															<Link to={redirectCategoryLink}>{item.category.categoryName}</Link>
														</span>
													</div>
													: null}
												<div className="cart-cat">Type :
											<span>Physical</span>
												</div>

											</td>
											<td className="acctulproduct-price">
												<span className="price-amount"><span><span className="currency-icon">$</span>{item.productPrice}</span></span>
												{
													item.isActive ?
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
														<span className="btn-number qtyminus quantity-minus" onClick={this.handleMinus.bind(this, item.id, item.quantity, item.isActive)}>-</span>
														<input type="text" data-step="1" value={item.quantity} data-min="0" data-max="" name="cartqty" className="input-qty qty" size="4" />
														<span className="btn-number qtyplus quantity-plus" onClick={this.handleAdd.bind(this, item.id, item.quantity, item.remainingQuantity, index, item.isActive, item.isActive)}>+</span>
													</div>
												</div>
												<span className="errorCart text-danger">{this.state.errors[index]}</span>
											</td>
											<td className="product-price">
												<span className="price-amount"><span><span className="currency-icon">$</span>{item.productPrice * item.quantity}</span></span>
												<div className="">
													<span className="remove-link cursor-point" onClick={this.removefromCart.bind(this, item.id, item.quantity)}><i className="fa fa-trash" aria-hidden="true"></i> Remove</span>
												</div>
											</td>
										</tr>
									}

								}) :
								null
						}
					</tbody>
				</table>
			</div>
		)
	}
}

class CartWithOutLoginGiftList extends Component {

	removefromCart(productId, count) {
		this.props.removefromCart(productId, count,"giftcard");
	}

	handleMinus(productId, quantity, activeStatus) {
		this.props.handleMinus(productId, quantity, activeStatus,"giftcard");
	}

	handleAdd = (productId, quantity, remainingQuantity, index, activeStatus) => {
		this.props.handleAdd(productId, quantity, remainingQuantity, index, activeStatus,"giftcard");
	}
	render() {
		const { item, redirectLink, index, errors } = this.props;
        const img = (item.smallImageThumbnail) ? AppConfig.cdn + item.smallImageThumbnail: '/assets/img/gift-placeholder.jpg'
		return (
			<tr className="cart-item" key={index}>
				<td className="product-thumbnail">
					<Link target="_blank" to={redirectLink} className="link-product" >
						<div className="cart-thumbnail">
							<img alt="" src={img} className="cart-image" />
						</div>
					</Link>
				</td>
				<td className="product-name">
					<Link target="_blank" to={redirectLink} className="text-link">{item.title}</Link>
					<div className="cart-cat">Type :
						<span>GiftCard</span>
					</div>

				</td>
				<td className="acctulproduct-price">
					<span className="price-amount"><span><span className="currency-icon">$</span>{item.giftcardPrice}</span></span>
					{
						item.isActive ?
							null
							:
							<div className="errorCart text-danger">
								<span>Gift Card Is Not Available</span>
							</div>
					}
				</td>
				<td className="product-quantity">
					<div className="quantity">
						<div className="control">
							<span className="btn-number qtyminus quantity-minus" onClick={this.handleMinus.bind(this, item.id, item.quantity, item.isActive)}>-</span>
							<input type="text" data-step="1" value={item.quantity} data-min="0" data-max="" name="cartqty" className="input-qty qty" size="4" />
							<span className="btn-number qtyplus quantity-plus" onClick={this.handleAdd.bind(this, item.id, item.quantity, item.remainingQuantity, index, item.isActive, item.isActive)}>+</span>
						</div>
					</div>
					<span className="errorCart text-danger">{errors[index]}</span>
				</td>
				<td className="product-price">
					<span className="price-amount"><span><span className="currency-icon">$</span>{item.giftcardPrice * item.quantity}</span></span>
					<div className="">
						<span className="remove-link cursor-point" onClick={this.removefromCart.bind(this, item.id, item.quantity)}><i className="fa fa-trash" aria-hidden="true"></i> Remove</span>
					</div>
				</td>
			</tr>
		)
	}
}

export default Cart;
