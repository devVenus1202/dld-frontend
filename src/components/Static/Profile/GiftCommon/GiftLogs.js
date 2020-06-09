import React, { Component } from "react";
// import { Table } from "react-bootstrap";
import Constant from "../../../../config/Constant";
import LeftSidebar, { LeftSidebarMobileView	} from "../LeftSidebar";
// import PhysicalProductOrders from "../PhysicalProductOrders";
import CommonGiftLogs from "./CommonGiftLogs";
// import { ApiHelper } from "./../../../helpers/ApiHelper";
// import { ToastStore } from "react-toasts";
// import { Loader } from "../../Static/Common/Loader/Loader";

class GiftLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <section className="dashboard-page">
        <nav className="breadcrumb">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/orders">Orders</a>
            </li>
            <li>Order-Logs</li>
          </ul>
        </nav>
        <div className="row dashboard">
          <div className="clearfix dashboard-width-wrap">
          <LeftSidebarMobileView />	
            <div className="col-md-2 col-sm-3 dashboard-left-warp">
              <div className="dashboard-left">
                <h1>Order-Logs</h1>
                <LeftSidebar />
              </div>
            </div>
            <div className="col-md-10 col-sm-9 dashboard-right-warp">
              <div className="dashboard-right section-white">
                <div className="heading">
                  <img
                    alt=""
                    src={
                      Constant.frontUrl + "/assets/img/icons/address_black.svg"
                    }
                    width="25px"
                  />
                  Order-Logs
                </div>
                <div className="clearfix" />
                <div className="col-sm-12 center-block">
                    <div id="productid" ref="productSection">
                      <CommonGiftLogs />
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

export default GiftLogs;
