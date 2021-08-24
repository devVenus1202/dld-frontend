import React, {Component} from "react";
import {connect} from "react-redux";
import * as Style from "./splash-screen.css";
import AuthPopup from '../../../container/AuthPopup/AuthPopup';
import {
  profileInfoRequest,
  homePagePopularWebinarsAndProductsRequest, settingsRequest, productAllDataClearRequest
} from "../../../actions";
import GreetingsPopup from "../../../container/GreetingsPopup";
import Header from '../../../container/Header/Header';
import Footer from '../../../container/Footer/Footer';
import HomeContent from './HomeContent.js';
import MainMenu from "../../../container/MainMenu/MainMenu";

class FirstPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAuth: false,
      greetings: false,
      welcome: false,
      showMenu: false,
    };
  }

  componentWillMount() {
    this.props.checkUserAuth();
    this.props.fetchData();
    this.props.settingsRequest();
  }

  toggleMenuOpen = () => {
    const {onProductDataClear} = this.props;
    onProductDataClear();
    this.setState(prevState => ({
      showMenu: !prevState.showMenu,
    }));
  };

  closeMainMenu = () => {
    this.setState({
      showMenu: false,
    });
  };

  handleAuthOpen = () => {
    this.setState({
      showAuth: true,
      showMenu: false
    });
  };

  handleAuthClose = () => {
    this.setState({
      showAuth: false
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
    const {
      popularProductsAndWebinars,
      history,
      onProductDataClear
    } = this.props;

    const {showMenu, showAuth, greetings, welcome} = this.state;

    const popularProducts = popularProductsAndWebinars.physical;
    const popularWebinars = popularProductsAndWebinars.digital;
    return (
      <section className={Style["splash-screen-section"]}>
        <div className={Style["fluid-cotainer"]}>
          <div className={Style["splash-image-wrap"]}>
            <Header {...this.props} toggleMenuOpen={this.toggleMenuOpen} handleAuthOpen={this.handleAuthOpen}
                    showMenu={showMenu} afterLogoClick={this.closeMainMenu}/>
            <div className={Style["theme-container"]}>
              <div className="content">
                <div className="hero-container">
                  <h2>World famous gun reviews</h2>
                  <h3>We provide digital webinars and physical products</h3>
                </div>
                <HomeContent
                  onProductDataClear={onProductDataClear}
                  history={history}
                  popularProducts={popularProducts}
                  popularWebinars={popularWebinars}
                />
              </div>
            </div>
          </div>
        </div>
        {showMenu && <MainMenu {...this.props} close={this.toggleMenuOpen}/>}
        {showAuth &&
        <AuthPopup {...this.props} handleAuthClose={this.handleAuthClose} openGreetingsPopup={this.openGreetingsPopup}
                   openWelcomePopup={this.openWelcomePopup}/>}
        {greetings && <GreetingsPopup close={this.closeGreetingsPopup}/>}
        {welcome && <GreetingsPopup newUser close={this.closeWelcomePopup}/>}
        <Footer settings={this.props.settings}/>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.loginReducer.isLoggedIn,
  settings: state.settingsReducer,
  popularProductsAndWebinars: state.productListReducer.homePagePopularProductsAndWebinars || {
    physical: [],
    digital: []
  },
});

const mapDispatchToProps = dispatch => ({
  checkUserAuth: payload => dispatch(profileInfoRequest(payload)),
  fetchData: payload => {
    dispatch(homePagePopularWebinarsAndProductsRequest());
  },
  settingsRequest: data => {
    dispatch(settingsRequest(data));
  },
  onProductDataClear: data => {
    dispatch(productAllDataClearRequest());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FirstPage);
