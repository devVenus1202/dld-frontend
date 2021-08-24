import React, { Component } from 'react';
import { withRouter } from "react-router";
import Constant from "../../../config/Constant";


class NoWebinars extends Component {

    render() {
        return (
            <div className="no-webinars-container">
                <img alt=""src={Constant.frontUrl+"/assets/img/icons/ico-webinars-big.svg"} width="100px"/>
                <h3>No Webinars Yet</h3>
                <p>All purchased webinars will appear in this section</p>
                <button className="btn-effect one">Discover Webinars</button>
            </div>
        )
    }
};

export default withRouter(NoWebinars);
