import React, { Component } from 'react';
import CommonGiftLogs from '../../components/Static/Profile/GiftCommon/CommonGiftLogs';
import { AppConfig } from "../../config/AppConfig";
import { ApiHelper } from '../../helpers/ApiHelper';
class GiftCardTrackPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            trackingId: "",
            isSubmitted: false,
            giftcardCodeData: [],
            giftcardlogsData: [],
            errorMessage: '',
            isLoading: false

        }
    }
    componentDidMount () {
        window.scrollTo(0,0);
    }

    handleTrack = (e) => {
        this.setState({ trackingId: e.target.value,errorMessage: '' });
    }

    submitTrackId = async () => {
        this.setState({
            isSubmitted: true,
            errorMessage: ""
        });
        if (this.state.trackingId === '') {
            this.errorHandler();
            return;
        }
        this.setState({ isLoading: true });
        let data = {
            giftCardCode: this.state.trackingId
        };
        let api = new ApiHelper();
        let resultData = await api.FetchFromServer(
            '/',
            'giftCardOrder/trackGiftCard',
            'POST',
            false,
            undefined,
            data
        );
        const stateThis = this;
        if (!resultData.isError) {
            stateThis.setState({
                giftcardCodeData: resultData.data.giftcardCode,
                giftcardlogsData: resultData.data.giftcardlogs,
                isLoading: false
            });
        }
        else {
            this.setState({
                isLoading: false,
                errorMessage: resultData.messages[0],
                giftcardCodeData: [],
                giftcardlogsData: []
            })
        }
    }

    errorHandler = () => {
        setTimeout(() => {
            this.setState({
                isSubmitted: false
            });
        }, 4000);
    };

    render() {
        const { giftcardCodeData, isLoading } = this.state;
        return (
            <section className="faq-page margin50">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="page-head">
                            <h1>
                                <span>Tracking Gift Card</span>
                            </h1>
                        </div>

                        <div className="gift-track-wrap">
                            <div className="track-search-wrap col-xs-12 col-sm-8 col-md-7 center-block">
                                {
                                    this.state.errorMessage !== "" ?
                                        <p className="remove-link">{this.state.errorMessage}</p>
                                        : null
                                }

                                <div class="track-search-inner">
                                    <div class="input-group">
                                        <input type="text" className="form-control" id="" name="trackingId" onChange={this.handleTrack} placeholder="Enter your gift card number" value={this.state.trackingId} autocomplete="off" />
                                        <span class="input-group-addon no-padding" id="">
                                        { isLoading ?
                                         <button onClick={this.submitTrackId} type="submit" class="btn-effect one btn-search-prod"> <img src={AppConfig.frontUrl + "/assets/img/icons/Icon_Search.svg"} alt="" width="18" /> Processing ...</button>
                                        :
                                            <button onClick={this.submitTrackId} type="submit" class="btn-effect one btn-search-prod"> <img src={AppConfig.frontUrl + "/assets/img/icons/Icon_Search.svg"} alt=""  width="18" /> Search</button>
                                        }
                                        </span>
                                    </div>
                                    {
                                        this.state.isSubmitted && this.state.trackingId === '' ?
                                            <p className={'text-danger-checkout'}>
                                                Please enter gift card number
                                            </p>
                                            :
                                            null
                                    }
                                </div>
                            </div>
                            <div className="gift-trcking-details-wrap">
                            { this.state.giftcardlogsData.length ? 
                                <div className="gift-amount-remaining">
                                    <h2>Remaining Amount: <span className="font-roboto">${giftcardCodeData && giftcardCodeData.remainingPrice ? giftcardCodeData.remainingPrice: 0}</span></h2>
                                </div> : null }
                                <CommonGiftLogs 
                                    isLoading={this.state.isLoading}               
                                    giftcardlogsData={this.state.giftcardlogsData}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default GiftCardTrackPage;