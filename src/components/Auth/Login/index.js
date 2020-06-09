import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import {fbloginRequest, glloginRequest, loginCartRequest, loginRequest, profileInfoRequest,} from "../../../actions";
import qs from "query-string";
import {validation} from "../../../config/validationError";
import {store} from "../../../App";
import FacebookLoginButton from '../Social/FaceBookLoginPage';
import GoogleLoginButton from '../Social/GoogleLoginPage';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errorClass: "display_none",
            errorClassEmail: "display_none",
            errorClassPassword: "display_none",
            errorMsgEmail: "Error",
            errorMsgPassword: "Error",
            errorMessage: ""
        };
    }

    componentWillMount() {
        const storageSession = JSON.parse(localStorage.getItem("localStorageVal"));
        if (storageSession) {
            this.props.profileInfoAction();
        }
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };

    updateEmail(e) {
        this.setState({email: e.target.value.replace(/\s/g, "")});
    }

    updatePassword(e) {
        this.setState({password: e.target.value});
    }

    handleSubmit = async event => {
        const {
            handleAuthClose,
            openGreetingsPopup,
            guestOption,
            guestFn,
        } = this.props;
        event.preventDefault();

        if (this.state.email === "") {
            this.setState({errorClassEmail: "show_block"});
            this.setState({errorMsgEmail: validation.emailValidation});
            return;
        } else {
            this.setState({errorClassEmail: "display_none", errorMsgEmail: ""});
        }

        var emailValid = this.state.email.match(
            /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
        );
        if (emailValid) {
            if (this.state.password === "") {
                this.setState({errorClassPassword: "show_block"});
                this.setState({errorMsgPassword: validation.passwordValidation});
                return;
            } else {
                this.setState({
                    errorClassPassword: "display_none",
                    errorMsgPassword: ""
                });
            }
            const {location} = this.props;
            const {search} = location;
            let returnUrl = qs.parse(search).returnUrl;
            const objectData = {
                email: this.state.email,
                password: this.state.password,
                returnUrl
            };
            this.setState({disabledLogin: true});

            const unsubscribe = store.subscribe(() => {
                const state = store.getState();
                const isLoggedIn = state.loginReducer.isLoggedIn;

                if (isLoggedIn) {
                    handleAuthClose();
                    openGreetingsPopup();
                    unsubscribe();
                }
            });

            if (guestOption || guestFn) {
                this.props.loginUserCart(objectData);
            } else {
                this.props.loginUser(objectData);
            }

            setTimeout(() => {
                this.setState({disabledLogin: false});
            }, 3000);
        } else {
            this.setState({errorMsgEmail: validation.emailInvalid, errorClassEmail: "show_block"});
            return;
        }
    };

    responseFacebook = (response) => {
        this.props.fbloginAction(response, this.props.handleAuthClose);
    };

    failureFacebook = (response) => {
        console.log(response);
    };

    responseGoogle = (response) => {
        const {location, handleAuthClose} = this.props;
        const {search} = location;
        let returnUrl = qs.parse(search).returnUrl;
        let data = {
            googleData: response,
            returnUrl
        };
        this.props.googleLoginAction(data, handleAuthClose);
    };

    failureGoogle = (response) => {
        console.log(response);
    };

    render() {
        const {forgotPasswordOpen} = this.props;

        return (
            <div className="clearfix form-block">
                <form
                    id="loginform"
                    method="POST"
                    onSubmit={this.handleSubmit}
                >
                    <div className={this.state.errorClass + " error-msg"}>
                        {this.state.errorMessage}
                    </div>
                    <div className="form-group">
                        <label htmlFor="Email">Email<span className="mandatory">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            id="Email"
                            name="email"
                            placeholder="john@example.com"
                            autoComplete={"new-password"}
                            onChange={this.updateEmail.bind(this)}
                            value={this.state.email}
                        />
                        <div
                            className={this.state.errorClassEmail + " error-msg"}
                        >
                            {this.state.errorMsgEmail}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="Password">Password <span className="mandatory">*</span>
                            <span className="link" onClick={forgotPasswordOpen}>Forgot password?</span>
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="Password"
                            name="password"
                            placeholder="******"
                            autoComplete={"new-password"}
                            onChange={this.updatePassword.bind(this)}
                        />
                        <div
                            className={
                                this.state.errorClassPassword + " error-msg"
                            }
                        >
                            {this.state.errorMsgPassword}
                        </div>
                    </div>
                    <div className="form-group form-button">
                        {
                            this.state.disabledLogin ?
                                <button disabled className="btn-effect one">
                                    Please Wait...
                                </button> :
                                <button id="submit" className="btn-effect one">
                                    Login
                                </button>
                        }
                        {/*<FacebookLoginButton
                            callback={this.responseFacebook}
                            failure={this.failureFacebook}
                        />
                        <GoogleLoginButton
                            callback={this.responseGoogle}
                            failure={this.failureGoogle}
                        />*/}
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loginState: state.loginReducer
    };
};
const mapDispatchProps = dispatch => {
    return {
        loginUser: async userData => await dispatch(loginRequest(userData)),
        loginUserCart: async userData => await dispatch(loginCartRequest(userData)),
        profileInfoAction: () => {
            dispatch(profileInfoRequest());
        },
        fbloginAction: async (data, closePopup) => {
            await dispatch(fbloginRequest(data));
            closePopup();
        },
        googleLoginAction: async (data, closePopup) => {
            await dispatch(glloginRequest(data));
            closePopup();
        }
    };
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchProps
)(Login));
