import React, { Component } from 'react';
import Constant from '../../../config/Constant';
import LeftSidebar, { LeftSidebarMobileView	} from "./LeftSidebar";
class OrderDetail extends Component {
  render() {
    return (      
		<section className="dashboard-page">
			<nav className="breadcrumb">
				<ul>
					<li><a href="/">Home</a></li>
					<li>Profile</li>
				</ul>
			</nav>
			<div className="row dashboard">
				<div className="clearfix dashboard-width-wrap">
				<LeftSidebarMobileView />	
					<div className="col-md-2 col-sm-3 dashboard-left-warp">
						<div className="dashboard-left">
							<h1>My Account </h1>
							<LeftSidebar />
						</div>
					</div>
					<div className="col-md-10 col-sm-9 dashboard-right-warp">
						<div className="dashboard-right section-white">
							<div className="heading">
								<img alt="" src={Constant.frontUrl+"/assets/img/icons/order_black.svg"} width="25px"/>
								My Order Details
							</div>
							<div className="clearfix"></div>
							<div className="a-row orderDetailsWrap">
								<div className="col-lg-12 col-md-12">
									<div className="a-row shipment-step">
										<div className="col-xs-4 shipment-step-step active complete">
											<div className="shipment-progress">
												<div className="shipment-progress-bar"></div>
											</div>
											<div className="shipment-step-icon with-hover-image">
												<div className="panel-image">
													<span>
														<img alt="" className="active-image" src={Constant.frontUrl+"/assets/img/order-status/shopping-cart.svg"} width="40" height="40"/>
														<img alt="" className="hover-image" src={Constant.frontUrl+"/assets/img/order-status/shopping-cart-white.svg"} width="40" height="40"/>
													</span>
												</div>
											</div>
											<div className="shipment-step-info text-center">
												Order Placed
												<p className="date">23 Nov 2018 07:15:17 PM</p>
											</div>
										</div>
										<div className="col-xs-4 shipment-step-step">
											<div className="shipment-progress">
												<div className="shipment-progress-bar"></div>
											</div>
											<div className="shipment-step-icon with-hover-image">
												<div className="panel-image">
													<span>
														<img alt="" className="active-image" src={Constant.frontUrl+"/assets/img/order-status/delivery-truck.svg"} width="40" height="40"/>
														<img alt="" className="hover-image" src={Constant.frontUrl+"/assets/img/order-status/delivery-truck-white.svg"} width="40" height="40"/>
													</span>
												</div>
											</div>
											<div className="shipment-step-info text-center">
												Confirm Dispatch                       
												<p className="date">23 Nov 2018 07:15:56 PM</p>
											</div>
										</div>
										<div className="col-xs-4 shipment-step-step">
											<div className="shipment-progress">
												<div className="shipment-progress-bar"></div>
											</div>
											<div className="shipment-step-icon with-hover-image">
												<div className="panel-image">
													<span>
														<img alt="" className="active-image" src={Constant.frontUrl+"/assets/img/order-status/delivered-box.svg"} width="40" height="40"/>
														<img alt="" className="hover-image" src={Constant.frontUrl+"/assets/img/order-status/delivered-box-white.svg"} width="40" height="40"/>
													</span>
												</div>
											</div>
											<div className="shipment-step-info text-center">
												Order Completed                       
												<p className="date">23 Nov 2018 07:16:23 PM</p>
											</div>
										</div>
									</div>
								</div>
								<div className="clearfix"></div>
								<div className="col-sm-12 center-block">
									<div className="order-detail-block ">
										<div className="order-detail-num-block clearfix">
											<div className="left-order-num">
												Order Id : #5181101488193467
											</div>
										</div>
										<div class="order-items-table a-row">
											<div class="orderItemBody">
												<div class="col col-thumb">
													<div class="figure figure-thumb">
															<img alt="" src="https://cdn.shopify.com/s/files/1/2041/4955/products/image_65e48ea5-2472-400f-b260-14dc7ed3e904_400x.jpg?v=1524186422"/>
													</div>
												</div>
												<div class="col col-name">
													<div class="name">
															Mi LED Smart TV 4A 108 cm (43)
													</div>
												</div>
												<div class="col col-price">
													<div class="price"><span class="font-roboto">$</span>21,999 × 1</div>
												</div>
												{/* <div class="col col-actions">
													<span class="label"><a href="" target="_blank">Download Invoice</a></span>
												</div> */}
											</div>
											</div>
										<div className="order-detail-info">
											<h3>
												Delivery address
											</h3>
											<table className="info-table">
												<tbody>
													<tr>
														<th>Name</th>
														<td>Amitesh</td>
													</tr>
													<tr>
														<th>Address</th>
														<td>
															301 Prosperity Building, 1, Diamond Colony, INDORE, MADHYA PRADESH-452001            
														</td>
													</tr>
													<tr>
														<th>Phone</th>
														<td>7566258181</td>
													</tr>
												</tbody>
											</table>
										</div>
										<div className="order-detail-info">
											<h3>
												PAYMENT MODE AND DELIVERY TIME      
											</h3>
											<table className="info-table">
												<tbody>
													<tr>
														<th>Payment mode</th>
														<td>COD</td>
													</tr>
													<tr>
														<th>Delivery time</th>
														<td>
															Packages are delivered between 09:00 -19:00 from Monday to Saturday. There are no deliveries on Sunday and on public holidays.           
														</td>
													</tr>
												</tbody>
											</table>
										</div>
										<div className="order-detail-total">
											<table className="total-table">
												<tbody>
													<tr>
														<td>Net amount : <font className="font-roboto">$</font>22,498</td>
													</tr>
													<tr>
														<td>Discount : -<font className="font-roboto">$</font>0</td>
													</tr>
													<tr>
														<td className="total">
															Total amount : <span className="num"><font className="font-roboto">$</font>22,498</span>            
														</td>
													</tr>
													<tr>
														<td></td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>          
    )
  }
}

export default OrderDetail;
