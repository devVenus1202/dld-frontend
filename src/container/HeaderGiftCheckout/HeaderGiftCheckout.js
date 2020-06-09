import React from 'react';
import HeaderCheckout from './../Header/Header';
import FooterCheckout from '../Footer/Footer';
import {ToastContainer, ToastStore} from 'react-toasts';
import {settingsRequest} from "../../actions";
import {connect} from "react-redux";

class HeaderGiftCheckout extends React.Component {

  componentWillMount() {
    this.props.settingsRequest();
  }

  render() {
    return <div className="">
      <HeaderCheckout {...this.props}/>
      <div className="gift-checkout-section">
        <div className="theme-container">
          {this.props.children}
        </div>
      </div>
      <FooterCheckout settings={this.props.settings}/>
      <ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_RIGHT} lightBackground/>
    </div>;
  }
}

const mapStateToProps = state => ({
  settings: state.settingsReducer
});

const mapDispatchToProps = dispatch => ({
  settingsRequest: data => {
    dispatch(settingsRequest(data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderGiftCheckout);
