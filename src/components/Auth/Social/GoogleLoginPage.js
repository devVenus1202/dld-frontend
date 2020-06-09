import React, {Component} from 'react';
import {AppConfig} from '../../../config/AppConfig';
import GoogleLogin from 'react-google-login';

class GoogleLoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        const {
            callback,
            failure,
        } = this.props;

        return (
            <div className="gl-login">
                <GoogleLogin
                    className="gl-social-button"
                    render={renderProps => (
                        <button className="btn btn-gl" onClick={renderProps.onClick}><span
                            className="social-button-img"><img src={AppConfig.frontUrl +
                        "/assets/img/LoginIcon_Google.svg"} width="50" alt=""/></span>Continue with Google</button>
                    )}
                    style={{width: 100 + '%'}}
                    clientId="1064752081280-p48d82cnvop6chsh85m17p93c4ei1jtg.apps.googleusercontent.com"
                    onSuccess={callback}
                    onFailure={failure}
                />
            </div>
        );
    }
}

export default GoogleLoginPage;
