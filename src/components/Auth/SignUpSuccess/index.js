import React from "react";

class SignUpSuccess extends React.Component {
    render() {
        const {userName, newUser, close} = this.props;

        return (
            <div className="welcome-popup">
                {
                    newUser ? (
                        <div className="welcome-content">
                            <h3>Welcome, {userName}</h3>
                            <p>Your account has been successfully created</p>
                        </div>
                    ) : (
                        <div className="welcome-content">
                            <h3>Welcome Back, {userName}</h3>
                            <p>You are successfully logged in</p>
                        </div>
                    )
                }
                <button className="btn-effect one" onClick={close}>Continue</button>
            </div>
        );
    }
}

export default SignUpSuccess;
