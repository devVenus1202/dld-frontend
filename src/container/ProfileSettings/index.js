import React, {Component} from "react";
import {connect} from "react-redux";
import InputRange from "react-input-range";
import {
    saveProfileSettingsRequest,
} from "../../actions";
import {LeftSidebarMobileView} from "../../components/Static/Profile/LeftSidebar";
import Loading from "../../components/Static/Common/Loader/Loader";
import LeftSidebar from "../../components/Static/Profile/LeftSidebar";
import Constant from "../../config/Constant";

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialized: false,
            newsLetterLimit: 1,
        };
    }

    componentDidMount() {
        this.initLimitValue();
    }

    componentDidUpdate() {
        this.initLimitValue();
    }

    initLimitValue = () => {
        const {
            profileInfo,
        } = this.props;
        const {
            initialized,
        } = this.state;

        if (!initialized && profileInfo && Object.keys(profileInfo).length) {
            this.setState({
                newsLetterLimit: profileInfo.newsLettersLimitPerWeek || 0,
                initialized: true,
            });
        }
    };

    changeRange = value => {
        this.setState({ newsLetterLimit: value });
    };

    handleSubmit = () => {
        const {
            onSubmit,
        } = this.props;
        const {
            newsLetterLimit,
        } = this.state;
        const data = {
            newsLetterLimit,
        };

        onSubmit(data);
    };

    render() {
        const {
            saveLoading,
        } = this.props;
        const {
            newsLetterLimit,
        } = this.state;

        return (
            <section className="dashboard-page">
                <nav className="breadcrumb">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li>Settings</li>
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
                                    <img alt="" src={Constant.frontUrl+"/assets/img/icons/ico-settings.svg"} width="25px"/>
                                    Newsletter Settings
                                </div>
                                <div className="clearfix" />
                                <div className="col-sm-8 center-block range-small">
                                    <div>
                                        <span className="range-title">Newsletter limit per week: {newsLetterLimit}</span>
                                        <span className="range-cover">
                                            <span className="range-min">1</span>
                                           <InputRange
                                               maxValue={7}
                                               minValue={1}
                                               value={newsLetterLimit}
                                               onChange={this.changeRange}
                                           />
                                            <span className="range-max">7</span>
                                       </span>
                                    </div>
                                    {
                                        saveLoading
                                            ? (<Loading />)
                                            : (<button type="button" className="btn-effect" onClick={this.handleSubmit}>Save</button>)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => ({
    saveLoading: state.profileInfoReducer.saveProfileSettingsLoading,
    profileInfo: state.profileInfoReducer && state.profileInfoReducer.profileInfo,
});

const mapDispatchProps = dispatch => ({
    onSubmit: payload => dispatch(saveProfileSettingsRequest(payload)),
});

export default connect(
    mapStateToProps,
    mapDispatchProps
)(Index);
