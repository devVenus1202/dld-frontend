import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Guest extends Component {

    handleClick = () => {
        if (this.props.checkoutRedirection) {
            this.props.checkoutRedirection("giftCard");
        }
    };

    afterRedirect = () => {
        const {
            afterRedirect,
        } = this.props;

        if (afterRedirect && typeof afterRedirect === 'function') {
            afterRedirect();
        }
    };

    render() {
        //const asAGuset = this.props.AsAGuest;
        const {giftCardRedirection} = this.props;

        return (
            <div className="modal-form-items">
                <form id="loginform" method="POST" onSubmit={this.handleSubmit}>
                    <div className="guestText">
                        <h4>No account or login required.</h4>
                        <p>After your order is placed, you may create a new DLDVIP account.</p>
                        <p className="points">User purchases the product as a guest user then a user will not get reward
                            points.</p>
                    </div>
                    <div>
                        <div className="guest-user">
                            {
                                giftCardRedirection ?
                                    <button onClick={this.handleClick}
                                            className="btn-orange one">Continue as Guest</button>
                                    :
                                    <Link to="/checkout" onClick={this.afterRedirect} className="btn-orange one">Continue as Guest</Link>
                            }

                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default Guest;
