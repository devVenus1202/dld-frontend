import React from 'react';
import { connect } from 'react-redux';
import SignUpSuccess from "../../components/Auth/SignUpSuccess";

class Greeetings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    handleClose = () => {
        const {
            guestFn,
            close,
        } = this.props;

        if (guestFn) {
            window.location.reload();
        }
    
        if (window.location.pathname === '/cart') {
            setTimeout(()=>{window.location.reload()}, 50)
        } else {
            close();
        }
        
    }

    render() {
        const {
            close,
            userName,
            newUser,
            guestFn,
        } = this.props;

        return (
            <div className="full-screen-popup">
                <div className="popup-paper">
                    <div className="popup-title">
                        <div className="popup-logo" />
                        <div onClick={this.handleClose} className="btn-effect one popup-close-btn">
                            <span/>
                        </div>
                    </div>
                    <SignUpSuccess newUser={newUser} userName={userName} close={this.handleClose} />
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        userName: (state.profileInfoReducer && state.profileInfoReducer.profileInfo && state.profileInfoReducer.profileInfo.firstName) || 'User',
    }),
    dispatch => ({

    }),
)(Greeetings);
