import React, {Component} from "react";
import * as Style from "./Unsubscribe.css";
import qs from "query-string";
import {ApiHelper} from '../../helpers/ApiHelper';
import {
    Loader
} from "../../components/Static/Common/Loader/Loader";
import {AppConfig} from "../../config/AppConfig";

export default class Unsubscribe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reasonText: "",
            isLoading: false,
            resultError: "",
            resultErrorDisplay: false,
            successMessage: "",
            successMessageDisplay: false,
            resubscribed: false,
            sentFeedBack: false
        }
    }

    componentDidMount() {
        this.unsubscribe();
    }

    unsubscribe = async () => {
        const {
            location,
        } = this.props;
        const queryParams = qs.parse(location.search);
        const email = queryParams.data;

        if (!email) {
            return;
        }

        const api = new ApiHelper();
        const requestData = {
            email,
            isActive: false,
        };
        let result = await api.FetchFromServer('/', 'newsletter/unsubscribe', 'PUT', undefined, undefined, requestData);

        if (result.isError) {
            this.setState({
                resultError: 'Something went wrong. Please try again later.',
                resultErrorDisplay: true,
                isLoading: false,
            });
        } else {
            this.setState({
                isLoading: false,
                successMessageDisplay: true,
                successMessage: "You have successfully unsubscribed from the newsletter",
            });
        }
    };

    reasonHandler = (e) => {
        this.setState({reasonText: e.target.value});
    };

    saveReason = async () => {
        const {location} = this.props;
        const parsed = qs.parse(location.search);
        let api = new ApiHelper();
        let data = {
            email: parsed.data,
            reason: this.state.reasonText,
        };

        this.setState({isLoading: true});
        let result = await api.FetchFromServer('/', 'newsletter/unsubscribe/reason', 'PUT', undefined, undefined, data);

        if (result.isError) {
            this.setState({
                reasonError: 'Something went wrong. Please try again later.',
                reasonErrorDisplay: true,
                isLoading: false,
            });
        } else {
            this.setState({
                successMessageDisplay: false,
                isLoading: false,
                reasonText: "",
                sentFeedBack: true,
            });
        }
    };

    reSubscribe = async () => {
        const {location} = this.props;
        const parsed = qs.parse(location.search);
        let api = new ApiHelper();
        let data = {
            email: parsed.data,
            isActive: true,
        };

        this.setState({isLoading: true});
        let result = await api.FetchFromServer('/', 'newsletter/subscribe', 'POST', undefined, undefined, data);

        if (result.isError) {
            this.setState({
                reasonError: 'Something went wrong. Please try again later.',
                reasonErrorDisplay: true,
                isLoading: false,
            });
        } else {
            this.setState({
                isLoading: false,
                reasonText: "",
                successMessage: "",
                successMessageDisplay: false,
                resubscribed: true,
            });
        }
    };

    render() {
        return (
            <section className="unsubscribe-shop-page margin50">
                <div className="row">
                    <div>
                        {
                            this.state.isLoading
                                ? (<Loader/>)
                                : null
                        }
                        <div className="col-sm-8 center-block clearfix unsubscribe-cover">
                            {
                                this.state.resubscribed
                                    ? (
                                        <div className="unsubsc-thank-msg">
                                            <div className="thank-page-img">
                                                <img
                                                    className=""
                                                    src={
                                                        AppConfig.frontUrl +
                                                        "/assets/img/icons/thank-page-icon.svg"
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                            <h2 className="text-success"><span>You have been successfully subscribed</span></h2>
                                        </div>
                                    )
                                    : null
                            }
                            {
                                this.state.sentFeedBack
                                  ? (
                                    <div className="unsubsc-thank-msg">
                                        <div className="thank-page-img">
                                            <img
                                              className=""
                                              src={
                                                  AppConfig.frontUrl +
                                                  "/assets/img/icons/thank-page-icon.svg"
                                              }
                                              alt=""
                                            />
                                        </div>
                                        <h2 className="text-success"><span>Thank you for your feedback</span></h2>
                                    </div>
                                  )
                                  : null
                            }
                            {
                                this.state.resultErrorDisplay
                                    ? (
                                        <div className="unsubsc-thank-msg">
                                            <div className="thank-page-img">
                                                <img
                                                    className=""
                                                    src={
                                                        AppConfig.frontUrl +
                                                        "/assets/img/error/error_icons.svg"
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                            <h2 className="text-success"><span>{this.state.resultError}</span></h2>
                                        </div>
                                    )
                                    : null
                            }
                            {
                                this.state.successMessageDisplay && (
                                    <div className={Style["unsubscribe"]}>
                                        <h2 className={Style["heading"]}><span>You have been unsubscribed</span></h2>
                                        <p className={Style["head-para"]}>Please allow up to 48 hours for this change to take effect</p>
                                        <hr className={Style["divider"]}/>
                                        <p className={Style["head-reason"]}>Please specify the reason of unsubscribing</p>
                                        <div className="form-group">
                                            <textarea
                                                placeholder="Reason"
                                                rows="5"
                                                className="form-control"
                                                id=""
                                                name="reason"
                                                maxLength="250"
                                                value={this.state.reasonText}
                                                onChange={this.reasonHandler}
                                            />
                                        </div>
                                        <button
                                            className="btn-effect one"
                                            onClick={this.saveReason}
                                        >Send
                                        </button>
                                        <hr className={Style["divider"]}/>
                                        <p className={Style["mistake"]}>Did you unsubscribe by mistake?
                                            <button
                                                className={Style["re-subscribe-btn"]}
                                                onClick={this.reSubscribe}
                                            >Re-Subscribe</button>
                                        </p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </section>
        )

    }
}

