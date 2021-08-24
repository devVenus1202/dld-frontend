import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastStore } from 'react-toasts';
import { ApiHelper } from '../../helpers/ApiHelper';
import { giftCartListWithLoginRequest, giftCartListWithoutLoginRequest } from "../../actions";
import NoCart from '../../components/Static/Common/NoCart';
import GiftCheckoutWithLogin from "../../components/Static/GiftCheckOut/GiftCheckOutWithLogin";
import GiftCheckOutWithOutLogin from "../../components/Static/GiftCheckOut/GiftCheckOutWithOutLogin";
import deleteStorageFunction from "./DeleteGiftCart";
import localStorageFunction from "../GiftCardDetailPage/GiftLocalCart";
import GiftCheckOutForm from "../../components/Static/GiftCheckOut/GiftCheckOutForm";
import Loader from "../../components/Static/Common/Loader/Loader";
class GiftCheckout extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			errorAuth: false,
			errorMessage: '',
		};
	}

	async onDeleteFun(data) {

		const storageSession = JSON.parse(localStorage.getItem("localStorageVal"));
		if (storageSession) {
			//console.log(data);
			let api = new ApiHelper();
			let dataValue = { productId: data.productId };
			let result = await api.FetchFromServer(
				"/",
				"giftcard/delete",
				"DELETE",
				true,
				dataValue,
				undefined
			);
			if (result.isError) {
				ToastStore.error(result.messages[0]);
				return;
			}
			this.props.giftCartDataWithLogin();
		} else {
			deleteStorageFunction(data);
			this.props.giftCartDataWithOutLogin();
		}
	}

	async changeQuantity(productId, countNew) {
		const { giftCartDataWithOutLogin, giftCartDataWithLogin } = this.props;
		const storageSession = JSON.parse(localStorage.getItem("localStorageVal"));
		if (storageSession) {
			let dataValue = {
				productId: productId,
				quantity: countNew
			};
			let api = new ApiHelper();
			let result = await api.FetchFromServer(
				"/",
				"giftcard/addGiftCart",
				"POST",
				true,
				undefined,
				dataValue
			);
			if (result.isError) {
				//ToastStore.error(result.messages[0]);
				return;
			}
			giftCartDataWithLogin();
		} else {
			let dataValue = {
				productId: productId,
				count: countNew
			};
			localStorageFunction(dataValue);
			giftCartDataWithOutLogin();
		}
	}

	async componentDidMount() {
		const storageSession = JSON.parse(localStorage.getItem('localStorageVal'));
		if (storageSession) {			
			this.props.giftCartDataWithLogin();
		} else {
			this.props.giftCartDataWithOutLogin();
		}
	}
	
	render() {
		const { giftCartDataState } = this.props;
		const storageSession = JSON.parse(localStorage.getItem('localStorageVal'));
		//console.log(giftCartDataState.isLoading);
		return (
			<section className="gift-checkout-page minHight">
				<nav className="breadcrumb">
					<ul>
						<li>
							<a href="/gift-cards">Gift Card</a>
						</li>
						<li>Gift Checkout</li>
					</ul>
				</nav>
				{
					giftCartDataState.isLoading ? <Loader /> :
					giftCartDataState.cartProduct && giftCartDataState.cartProduct.length ?
						<div className="gift-checkout-wrap">
							<div className="row">
								<div className="col-md-8 product-cart-info">
									<div className="product-cart-info-holder">
										<div className="order-review">
											<h3><span>Order Overview</span></h3>
										</div>
										{

											storageSession ? 
												<GiftCheckoutWithLogin
													giftCartDataState={giftCartDataState}
													changeQuantity={this.changeQuantity.bind(this)}
													onDeleteFun={this.onDeleteFun.bind(this)} /> :
												<GiftCheckOutWithOutLogin
													giftCartDataState={giftCartDataState}
													onDeleteFun={this.onDeleteFun.bind(this)}
													changeQuantity={this.changeQuantity.bind(this)}
												/>
										}
										<div className="order-summary-warp">
											<div className="order-total-table-warp">
												{/* <div className="cart-coupon-wrap">
													<div className="coupon-cart">
														<div className="form-group">
															<input type="text" name="coupon-code" className="form-control coupon-code" id="" placeholder="Have a promo code?" value="" />
															<button className="btn-effect one apply-btn" name="apply_coupon" value="Apply coupon">Apply</button></div>
													</div>
												</div> */}
												<table className="table text-right noline-table order-summary-total table-condensed">
													<tbody>
														<tr>
															<th className="text-right">Subtotal :</th>
															<td>$ {giftCartDataState.subTotal ? giftCartDataState.subTotal : 0}</td>
														</tr>
														<tr className="grand-total-tr">
															<th className="text-right"><strong>TOTAL :</strong></th>
															<td><strong>$ {giftCartDataState.total ? giftCartDataState.total : 0}</strong></td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-4 billing-shipping-wrapper">
									<GiftCheckOutForm 
									giftCartDataState={giftCartDataState}/>
								</div>
							</div>
						</div>
						: (<NoCart />)
				}
			</section>
		);
	}
}


const mapStateToProps = (state) => {
	return {
		giftCartDataState: state.giftCartReducer,
	};
};

const mapDispatchProps = (dispatch) => {
	return {
		giftCartDataWithLogin: () => {
			dispatch(giftCartListWithLoginRequest());
		},
		giftCartDataWithOutLogin: () => {
			dispatch(giftCartListWithoutLoginRequest());
		}
	};
};

export default connect(mapStateToProps, mapDispatchProps)(GiftCheckout);
