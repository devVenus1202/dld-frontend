import React, {Component} from 'react';
import {AppConfig} from '../../../config/AppConfig';
// import FacebookLogin from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

class FaceBookLoginPage extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {
            callback,
            failure,
        } = this.props;
        const modevalu = "web"; // web or mobile

        return (
            <div className="fb-login">
                {
                    modevalu === "mobile" ?
                        <FacebookLogin
                            className="fb-social-button"
                            appId="563743324131914"
                            callback={callback}
                            onFailure={failure}
                            render={renderProps => (
                                <button className="btn btn-fb" onClick={renderProps.onClick}><span
                                    className="social-button-img"><img src={AppConfig.frontUrl +
                                "/assets/img/LoginIcon_Facebook.svg"} width="50" alt=""/></span>Continue with Facebook
                                </button>
                            )}
                            autoLoad={false}
                            fields="name,email,picture,first_name,last_name"

                        />
                        : <FacebookLogin
                            className="fb-social-button"
                            appId="791983124564985"
                            callback={this.responseFacebook}
                            onFailure={this.failureFacebook}
                            render={renderProps => (
                                <button className="btn btn-fb" onClick={renderProps.onClick}><span
                                    className="social-button-img"><img src={AppConfig.frontUrl +
                                "/assets/img/LoginIcon_Facebook.svg"} width="50" alt=""/></span>Continue with Facebook
                                </button>
                            )}
                            autoLoad={false}
                            fields="name,email,picture,first_name,last_name"
                        />
                }
            </div>
        );
    }
}

export default FaceBookLoginPage;
