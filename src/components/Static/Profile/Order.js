import React, { Component } from "react";
import ReactDOM from 'react-dom';
import Constant from "../../../config/Constant";
// import { AppConfig } from "../../../config/AppConfig";
import LeftSidebar, { LeftSidebarMobileView } from "./LeftSidebar";
import WebinarOrders from "./WebinarOrders";
import PhysicalProductOrders from "./PhysicalProductOrders";
// import GiftOrderTrackPage from "./GiftCommon/GiftOrderTrackPage";

class Order extends Component {
  componentDidMount() {
    if (this.props.location.hash === "#productid") {
      const tesNode = ReactDOM.findDOMNode(this.refs.productSection);
      tesNode.scrollIntoView();
    }
    if (this.props.location.hash === "#webinarid") {
      const tesNode = ReactDOM.findDOMNode(this.refs.webinarSection);
      tesNode.scrollIntoView();
    }
  }
  render() {
    return (
      <section className="dashboard-page">
        <nav className="breadcrumb">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>Order</li>
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
                  <img
                    alt=""
                    src={
                      Constant.frontUrl + "/assets/img/icons/order_black.svg"
                    }
                    width="25px"
                  />
                  My Orders
                </div>
                <div className="clearfix" />
                <div className="col-sm-12 center-block">
                  <div className="user-order-block">
                    <div id="webinarid" ref="webinarSection">
                      <WebinarOrders />
                    </div>
                    <div id="productid" ref="productSection">
                      <PhysicalProductOrders />
                    </div>
                    {
                      // AppConfig.mode == "dev" ?
                      //   <div id="giftId">
                      //     <GiftOrderTrackPage />
                      //   </div>
                      //   : null
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Order;
