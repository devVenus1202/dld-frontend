import React, { Component } from "react";
import { AppConfig } from "../../../../config/AppConfig";
import LeftSidebar, { LeftSidebarMobileView } from "../LeftSidebar";
import GiftOrderTrackPage from "../GiftCommon/GiftOrderTrackPage";

class MyGiftCards extends Component {
    render() {        
        return (
            <section className="dashboard-page">
                <nav className="breadcrumb">
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>Gift-Orders</li>
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
                                            AppConfig.frontUrl + "/assets/img/icons/order_black.svg"
                                        }
                                        width="25px"
                                    />
                                    My Gift Cards
                                </div>
                                <div className="clearfix" />
                                <div className="col-sm-12 center-block">
                                    <div className="user-order-block">
                                        <div id="giftId">
                                            <GiftOrderTrackPage />
                                        </div>
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

export default MyGiftCards;