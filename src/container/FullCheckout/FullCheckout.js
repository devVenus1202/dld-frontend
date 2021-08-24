import React from 'react';
import HeaderCheckout from './../HeaderCheckout/HeaderCheckout';
// import FooterCheckout from '../FooterCheckout/FooterCheckout';
import Footer from '../Footer/Footer';
import {ToastContainer, ToastStore} from 'react-toasts';
import {homePagePopularWebinarsAndProductsRequest, profileInfoRequest, settingsRequest} from "../../actions";
import {connect} from "react-redux";

class FullCheckout extends React.Component {

  componentWillMount() {
    this.props.settingsRequest();
  }

  render (){
    return <div className="">
      <HeaderCheckout {...this.props}/>
      <div className="theme-container">
        {this.props.children}
      </div>
      <Footer settings={this.props.settings}/>
      <ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_RIGHT} lightBackground/>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(FullCheckout);