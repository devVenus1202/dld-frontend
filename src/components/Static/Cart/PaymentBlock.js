import React, {Component} from 'react';
import {Link} from "react-router-dom";

class PaymentBlock extends Component {

  handleShowModel = () => {
    this.props.showLoginModel(true);
  };

  render() {
    const {
      cartData,
      loginState,
      openAuthPopupWithGuestOption
    } = this.props;
    return (
      <div>

        < div className="cart-totalWrap">
          <div className="cart-total-table-warp">
            <table className="table noline-table text-right cart-total-table table-condensed">
              <tbody>
              <tr>
                <th className="text-right">Subtotal :</th>
                <td>${cartData.subTotal}</td>
              </tr>
              {
                cartData.shipping > 0 ?
                  <tr>
                    <th className="text-right">Shipping :</th>
                    <td>${cartData.shipping}</td>
                  </tr>
                  :
                  null
              }

              <tr className="grand-total-tr">
                <th className="text-right"><strong>TOTAL :</strong></th>
                <td><strong>${cartData.total}</strong>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="cart-footer-wrap">
          <div className="cart-btn-block">
            <Link to="/" className="btn-effect one shopping-btn">Continue Shopping</Link>
          </div>
          <div className="cart-btn-block">
            {
              // displaySubmitButton ?
              loginState.isLoggedIn ?
                <Link to="/checkout" className="btn-effect one checkout-btn" onClick={this.goToCheckOut}>Checkout</Link>
                :
                <button className="btn-effect one checkout-btn" onClick={openAuthPopupWithGuestOption}>Proceed to
                  Checkout</button>

              // :
              // <button className="btn-effect one checkout-btn" disabled>Proceed to Checkout</button>
            }

          </div>
        </div>
        {/* <div className="cart-footer-wrap">
                <div className="cart-btn-block">
                    <button className="btn-effect one checkout-btn" onClick={this.handleShow}>Login</button>
                </div>
            </div> */}
      </div>
    );
  }
}

export default PaymentBlock;
