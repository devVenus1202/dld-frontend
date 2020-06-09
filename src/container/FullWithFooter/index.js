import React, {Component} from 'react';
import classNames from 'classnames';
import Header from './../Header/Header';
import AuthPopup from './../AuthPopup/AuthPopup';
import MainMenu from './../MainMenu/MainMenu';
import Footer from './../Footer/Footer';
import {ToastContainer, ToastStore} from 'react-toasts';
import GreetingsPopup from "../GreetingsPopup";
import {connect} from "react-redux";
import {settingsRequest} from "../../actions";

class FullWithFooter extends Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      showAuth: false,
      greetings: false,
      welcome: false,
      guestOption: false,
      guestFn: false,
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
      guestFn: true,
    });
  };

  handleAuthOpenWithGuestFn = () => {
    this.setState({
      showAuth: true,
      guestFn: true,
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
      guestFn: false,
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
      guestFn: false,
    });
  };

  render() {
    const {
      location,
    } = this.props;
    const {
      showMenu,
      showAuth,
      greetings,
      welcome,
      guestOption,
      guestFn,
    } = this.state;
    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        openLoginPopup: this.handleAuthOpen,
        openAuthPopupWithGuestOption: this.handleAuthOpenWithGuestOption,
      })
    );

    let openAuthPopupHeaderProp = this.handleAuthOpen;

    if (location.pathname === '/checkout') {
      openAuthPopupHeaderProp = this.handleAuthOpenWithGuestFn;
    }

    return (
      <div className={classNames('relative-container', {'overflow-hidden': showMenu})}>
        <Header
          {...this.props}
          toggleMenuOpen={this.toggleMenuOpen}
          handleAuthOpen={openAuthPopupHeaderProp}
          showMenu={showMenu}
        />
        {
          showMenu &&
          (
            <MainMenu
              {...this.props}
              close={this.toggleMenuOpen}
            />
          )
        }
        {
          showAuth &&
          (
            <AuthPopup
              {...this.props}
              guestOption={guestOption}
              guestFn={guestFn}
              handleAuthClose={this.handleAuthClose}
              openGreetingsPopup={this.openGreetingsPopup}
              openWelcomePopup={this.openWelcomePopup}
            />
          )
        }

        {
          greetings && (
            <GreetingsPopup
              close={this.closeGreetingsPopup}
              guestFn={guestFn}
            />
          )
        }
        {
          welcome && (
            <GreetingsPopup
              newUser
              guestFn={guestFn}
              close={this.closeWelcomePopup}
            />
          )
        }
        <div className="theme-container">{childrenWithProps}</div>
        <ToastContainer
          store={ToastStore}
          position={ToastContainer.POSITION.BOTTOM_RIGHT}
          lightBackground
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(FullWithFooter);