import React, { Component } from "react";
import { connect } from "react-redux";
import WebinarCartPage from "./WebinarCartPage";
class WebinarCheckOut extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    // let cartProductSession=JSON.parse(localStorage.getItem('cartProduct'));
    const storageSession = JSON.parse(localStorage.getItem("localStorageVal"));
    if (storageSession) {
      const { webinarCheckOutData } = this.props;
      if (webinarCheckOutData.webinarDetails.length <= 0) {
        this.props.history.push("/");
      }
    } else {
      this.props.history.push("/");
    }
  }

  render() {
    const { webinarCheckOutData } = this.props;
    return (
      <section className="cart-page">
        <div className="row">
          <div className="col-sm-12 cat-product">
            <div className="cart-holder-table">
              <WebinarCartPage cartData={webinarCheckOutData} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    webinarCheckOutData: state.webinarCheckOutReducer,
    loginState: state.loginReducer
  };
};

export default connect(
  mapStateToProps,
  undefined
)(WebinarCheckOut);
