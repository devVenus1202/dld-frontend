import React, {Component} from "react";
import {connect} from "react-redux";
import {
    userImageRequest,
} from "../../actions";
import DashboardPage from "../../components/Static/Profile/Dashboard";


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    imageAction = (imageData) => {
        this.props.userImageData(imageData);
    }

    render() {
        return (
            <DashboardPage
                imageAction={this.imageAction}
                profileInfoData={this.props.profileInfo}
                userImage={this.props.userImage}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        userImage: state.userImageReducer,
        profileInfo: state.profileInfoReducer
    };
};
const mapDispatchProps = dispatch => {
    return {
        userImageData: userData => {
            dispatch(userImageRequest(userData));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchProps
)(Dashboard);
