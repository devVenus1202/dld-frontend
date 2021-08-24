import React, {Component} from 'react';
import TabList from './TabList';
import Signup from '../../../container/Signup/Signup.js'
import Signin from '../Login'
import Guest from '../../../components/Static/Common/AuthModel/Guest';

export default class TabContent extends Component {
    render() {
        const {forgotPasswordOpen, handleAuthClose, openGreetingsPopup, openWelcomePopup, guestOption, guestFn} = this.props;
        const items = [
            (<div key="sign-in-auth" label="Sign In" className="tab-content">
                <Signin
                    openGreetingsPopup={openGreetingsPopup}
                    handleAuthClose={handleAuthClose}
                    forgotPasswordOpen={forgotPasswordOpen}
                    guestOption={guestOption}
                    guestFn={guestFn}
                />
            </div>),
            (<div key="sign-up-auth" label="Sign Up" className="tab-content">
                <Signup
                    handleAuthClose={handleAuthClose}
                    openWelcomePopup={openWelcomePopup}
                    guestOption={guestOption}
                    guestFn={guestFn}
                />
            </div>),
        ];

        if (guestOption) {
            items.push((
                <div key="guest-auth" label="Continue as Guest" className="tab-content">
                    <Guest afterRedirect={handleAuthClose} />
                </div>
            ));
        }

        return (
            <div>
                <TabList guestOption={guestOption} >
                    {items}
                </TabList>
            </div>
        );
    }
}
