import React, {Component} from 'react';
import {compose} from 'redux';
import classNames from 'classnames';
import Header from './../Header/Header';
import AuthPopup from './../AuthPopup/AuthPopup';
import GreetingsPopup from './../GreetingsPopup';
import MainMenu from './../MainMenu/MainMenu';
import {ToastContainer, ToastStore} from 'react-toasts';
import {settingsRequest} from "../../actions";
import {connect} from "react-redux";

class Full extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      showAuth: false,
      greetings: false,
      welcome: false,
      guestOption: false,
    };
  }

  componentWillMount() {
    this.props.settingsRequest();
  }

  toggleMenuOpen = () => {
    this.setState((previousState) => ({showMenu: !previousState.showMenu}));
  };

  handleAuthOpenWithGuestOption = () => {
    this.setState({
      showAuth: true,
      guestOption: true,
    });
  };

  handleAuthOpen = () => {
    this.setState({
      showAuth: true,
      showMenu: false,
    });
  };

  handleAuthClose = () => {
    this.setState({
      showAuth: false,
      guestOption: false,
    });
  };

  openGreetingsPopup = () => {
    this.setState({
      greetings: true,
    });
  };

  closeGreetingsPopup = () => {
    this.setState({
      greetings: false,
    });
  };

  openWelcomePopup = () => {
    this.setState({
      welcome: true,
    });
  };

  closeWelcomePopup = () => {
    this.setState({
      welcome: false,
    });
  };

  render() {
    const {showMenu, showAuth, greetings, welcome, guestOption} = this.state;
    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        openLoginPopup: this.handleAuthOpen,
        openAuthPopupWithGuestOption: this.handleAuthOpenWithGuestOption
      })
    );

    return (
      <div className={classNames({'overflow-hidden': showMenu})}>
        <Header {...this.props} toggleMenuOpen={this.toggleMenuOpen} handleAuthOpen={this.handleAuthOpen}
                showMenu={showMenu}/>
        {showMenu && <MainMenu {...this.props} close={this.toggleMenuOpen}/>}
        {showAuth && <AuthPopup {...this.props} guestOption={guestOption} handleAuthClose={this.handleAuthClose}
                                openGreetingsPopup={this.openGreetingsPopup} openWelcomePopup={this.openWelcomePopup}/>}
        {greetings && <GreetingsPopup close={this.closeGreetingsPopup}/>}
        {welcome && <GreetingsPopup newUser close={this.closeWelcomePopup}/>}
        <div className="theme-container">
          {childrenWithProps}
        </div>
        <ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_RIGHT} lightBackground/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    settingsData: state.settingsReducer
  };
};

const mapDispatchProps = dispatch => {
  return {
    settingsRequest: data => {
      dispatch(settingsRequest(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchProps
)(Full);
