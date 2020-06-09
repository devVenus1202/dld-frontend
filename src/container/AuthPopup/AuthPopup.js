import React from 'react';
import TabContent from '../../components/Auth/Tabs/TabContent'
import ForgotPassword from '../../components/Auth/ForgotPassword'

class AuthPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            forgotPassword: false,
            successMessage: false
        };
    }

    componentDidMount() {
        document.body.style.overflow = 'hidden';
    }

    componentWillUnmount() {
        document.body.style.overflow = 'visible';
    }

    forgotPasswordOpen = () => {
        this.setState({
            forgotPassword: true
        });
    };

    forgotPasswordClose = () => {
        this.setState({
            forgotPassword: false
        });
    };

    render() {
        const {handleAuthClose, openGreetingsPopup, openWelcomePopup, guestOption, guestFn} = this.props;
        const {forgotPassword} = this.state;

        return (
            <div className="full-screen-popup">
                <div className="popup-paper">
                    <div className="popup-title">
                        <div className="popup-logo" />
                        <div onClick={handleAuthClose} className="btn-effect one popup-close-btn">
                            <span/>
                        </div>
                    </div>
                    {
                        forgotPassword
                            ? (<ForgotPassword forgotPasswordClose={this.forgotPasswordClose}/>)
                            : (<TabContent
                                guestOption={guestOption}
                                guestFn={guestFn}
                                openWelcomePopup={openWelcomePopup}
                                openGreetingsPopup={openGreetingsPopup}
                                forgotPasswordOpen={this.forgotPasswordOpen}
                                handleAuthClose={handleAuthClose}
                            />)
                    }
                </div>
            </div>
        )
    }
}

export default AuthPopup;
