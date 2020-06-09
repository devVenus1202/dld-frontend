import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {AppConfig} from "../../../config/AppConfig";
class WebinarPage extends Component {	
    render() {
		const {webinarListData} = this.props;
		return (      
		<div id="" className="a-row list-group list-products-wrap">
			{ webinarListData.webinarList ?
				webinarListData.webinarList.map((item , index) => {
					return <div className="item width-product-list" key={index}>
						<div className="product-item img-shine-effect">
							<Link to ={item.status === "webinar" ? "/webinar-product/"+item.productSlug :  "/product/"+item.productSlug} className="product-inner shine-effect-inner clearfix">
								<div className="image-block">
									<div  className="list-image">
                                        <div
                                            style={{
                                                backgroundImage: `url(${(item.productImageThumbnail)})`,
                                                backgroundPosition: 'center center',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: 'cover',
                                            }}
                                        />
										{/*<img alt=" " src={item.productImageThumbnail} />*/}
									</div>
								</div>
								<div className="product-info">
									<h4 className="product-name product_title">
									{item.productName}
									</h4>
								</div>
								<div className="product-group-info">
									<div className="price">
									<span className="Price-amount">
										<span><span className="currencySymbol">$</span>{item.productPrice}</span>
									</span>
									</div>
									<div className="remaing-items">
									<span><font>{item.remainingQuantity}</font> {item.status === "webinar" ? "Views" : "Qty"} Remaining</span>
									</div>
								</div>
							</Link>
						</div>
					</div>							
				})
			: null}						
		</div>	      
    )
  }
}

export default WebinarPage;