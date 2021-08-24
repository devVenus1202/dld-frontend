import React, { Component } from "react";
class WebinarCartPage extends Component {
  render() {
    const { cartData } = this.props;
    return (
      <div className="table-wrap">
        <table className="table shop-table">
          <tbody>
            {cartData ? (
              <tr className="cart-item">
                <td className="product-thumbnail">
                  <div className="cart-thumbnail">
                    <img
                      alt=""
                      src={cartData.productDetails.smallImageThumbnail}
                      className="cart-image"
                    />
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    );
  }
}

export default WebinarCartPage;
