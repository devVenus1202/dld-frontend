import React, {Component} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import {signUpRequest, profileInfoRequest, signUpCartRequest} from '../../actions';
import Signup from '../../components/Auth/Signup/Signup.js';

class SignUp extends Component {

    componentWillMount() {
        const storageSession = JSON.parse(localStorage.getItem('localStorageVal'));
        if (storageSession) {
            this.props.profileInfoAction();
        }
    }

    signUpAction = (userData) => {
        const {
            openWelcomePopup,
            guestOption,
            guestFn,
            userSignUpAction,
            userSignUpCartAction,
        } = this.props;
        const signUpFn = (guestOption || guestFn) ? userSignUpCartAction : userSignUpAction;

        signUpFn({
            ...userData,
            openWelcomePopup,
        });
    };

    render() {
        const {
            signUpState,
            handleAuthClose,
        } = this.props;

        return (
            <Signup signUpAction={this.signUpAction} signUpState={signUpState} handleAuthClose={handleAuthClose}/>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loginState: state.loginReducer,
        signUpState: state.signUpReducer
    };
};

const mapDispatchProps = (dispatch) => {
    return {
        profileInfoAction: () => {
            dispatch(profileInfoRequest());
        },
        userSignUpAction: (registrationData) => {
            dispatch(signUpRequest(registrationData));
        },
        userSignUpCartAction: (registrationData) => {
            dispatch(signUpCartRequest(registrationData));
        }
    }
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchProps),
)(SignUp);
