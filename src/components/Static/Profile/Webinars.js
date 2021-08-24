import React, { Component } from "react";
import ReactDOM from 'react-dom';
import Constant from "../../../config/Constant";
import {WEBINAR_STATE_UPCOMING, WEBINAR_STATE_ONGOING, WEBINAR_STATE_COMPLETED} from "../../../constants";
import LeftSidebar, { LeftSidebarMobileView } from "./LeftSidebar";
import WebinarTypeList from "./WebinarTypeList";
import NoWebinars from "../NoWebinars";

class Order extends Component {
    componentDidMount() {
        if (this.props.location.hash === "#webinarUpcomingId") {
            const tesNode = ReactDOM.findDOMNode(this.refs.webinarUpcomingSection);
            tesNode.scrollIntoView();
        }
        if (this.props.location.hash === "#webinarCompletedId") {
            const tesNode = ReactDOM.findDOMNode(this.refs.webinarCompletedSection);
            tesNode.scrollIntoView();
        }
    }
    render() {
        const {myWebinar=false} = this.props;
        return (
            <section className="dashboard-page">
                <nav className="breadcrumb">
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>Webinars</li>
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
                        <div className="col-md-10 col-sm-9 dashboard-right-warp table-new-ui">
                            <div className="dashboard-right section-white">
                                <div className="col-sm-12 center-block ">
                                    <div className="user-order-block">
                                        { myWebinar ? (
                                        <NoWebinars/>
                                            ) : (
                                                <React.Fragment>
                                                    <div id="webinarUpcomingId" ref="webinarUpcomingSection" className="upcoming-webinars">
                                                        <WebinarTypeList
                                                            webinarState={[WEBINAR_STATE_UPCOMING]}
                                                            title="Upcoming Webinars"
                                                        />
                                                    </div>
                                                    <div id="webinarCompletedId" ref="webinarCompletedSection" className="completed-webinars">
                                                        <WebinarTypeList
                                                            webinarState={[WEBINAR_STATE_ONGOING, WEBINAR_STATE_COMPLETED]}
                                                            title="Completed Webinars"
                                                        />
                                                    </div>
                                                </React.Fragment>
                                            )}
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
