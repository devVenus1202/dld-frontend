import React from 'react';
import Header from './../Header/Header';
import {ToastContainer, ToastStore} from 'react-toasts';
import MainMenu from "../MainMenu/MainMenu";
import Footer from '../Footer/Footer';
import {connect} from "react-redux";
import {settingsRequest} from "../../actions";

class Full extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
  }

  toggleMenuOpen = () => {
    this.setState((previousState) => ({showMenu: !previousState.showMenu}));
  };

  componentWillMount() {
    this.props.settingsRequest();
  }

  render() {
    const {showMenu} = this.state;

    return (
      <div className="relative-container">
        <Header {...this.props} toggleMenuOpen={this.toggleMenuOpen} handleAuthOpen={this.handleAuthOpen}
                showMenu={showMenu}/>
        {showMenu && <MainMenu {...this.props}/>}
        <div className="dashboardWrap clearfix">
          <div className="theme-container">
            {this.props.children}
          </div>
        </div>
        <ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_RIGHT} lightBackground/>
        <div className="styled-footer">
          <Footer settings={this.props.settings}/>
        </div>
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Full);
