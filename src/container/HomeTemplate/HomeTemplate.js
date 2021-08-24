import React from 'react';
import Header from './../Header/Header';
import Footer from '../Footer/Footer';
import {ToastContainer, ToastStore} from 'react-toasts';
import {connect} from "react-redux";
import {settingsRequest} from "../../actions";

class HomeTemplate extends React.Component {
  componentWillMount() {
    this.props.settingsRequest();
  }

  render() {
    return <div className="">
      <Header {...this.props}/>
      <div className="home-wrap">
        {this.props.children}
      </div>
      <Footer settings={this.props.settings}/>
      <ToastContainer store={ToastStore} position={ToastContainer.POSITION.TOP_RIGHT} lightBackground/>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeTemplate);