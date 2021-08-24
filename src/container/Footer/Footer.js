import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Constant from '../../config/Constant';
import NewsLetter from '../../components/Static/NewsLetter/NewsLetter';
import {MenuName} from '../../config/MenuConstant';
import InstallButton from '../../components/Static/InstallApp';
import {set} from "react-ga";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deferredPrompt: null,
      isShowBtn: false
    };
  }

  handleRedirect = () => {
    const {
      closeOnRedirect,
    } = this.props;

    if (closeOnRedirect && typeof closeOnRedirect === 'function') {
      closeOnRedirect();
    }
  };

  componentWillMount() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.setState(
        {
          isShowBtn: true,
          deferredPrompt: e
        }
      );
    });
  }

  render() {

    const {deferredPrompt, isShowBtn} = this.state;
    const {settings} = this.props;
    const social = {};

    // eslint-disable-next-line no-mixed-operators
    (settings && settings.data || []).forEach((v)=>{
      social[v.meta_key] = v.meta_value;
    })

    return (
      <div className="footer-page">
        <footer className="theme-footer">
          <div className="row">
            <div className="col-sm-6 col-lg-3 col-md-3 footer-widget-block policy-information-widget">
              <div className="list-unstyled clear-margins">
                <div className="footer-widget">
                  <h1 className="title">Support</h1>
                  <ul className="list-unstyled link-list">
                    <li>
                      <Link
                        to={MenuName.FAQ.link}
                        className="widget-link"
                        onClick={this.handleRedirect}
                      >
                        {' '}
                        {MenuName.FAQ.menu}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={MenuName.Terms.link}
                        className="widget-link"
                        onClick={this.handleRedirect}
                      >
                        {' '}
                        {MenuName.Terms.menu}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={MenuName.Privacy.link}
                        className="widget-link"
                        onClick={this.handleRedirect}
                      >
                        {' '}
                        {MenuName.Privacy.menu}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={MenuName.Track_Gift_Card.link}
                        className="widget-link"
                        onClick={this.handleRedirect}
                      >
                        {' '}
                        {MenuName.Track_Gift_Card.menu}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-4 col-md-4 footer-widget-block stay-connected-widget">
              <div className="list-unstyled clear-margins">
                <div className="footer-widget">
                  <h1 className="title">Contacts</h1>
                  <div className="footer-address-section">
                    <ul className="list-unstyled link-list">
                      <li className="email-id">
                        <a href="mailto:Admin@thedldllc.com">admin@thedldllc.com</a>
                        <img
                          alt=""
                          src={Constant.frontUrl + '/assets/img/icons/close-envelope.svg'}
                          width="16"
                        />
                      </li>
                      <li className="phone-no">
                        <a href="tel:309.839.0527">309.839.0527</a>
                        <img
                          alt=""
                          src={Constant.frontUrl + '/assets/img/icons/phone-receiver.svg'}
                          width="16"
                        />
                      </li>
                      <li className="addressFooter categories-footer">
                        <img
                          alt=""
                          src={
                            Constant.frontUrl +
                            '/assets/img/icons/placeholder-filled-point.svg'
                          }
                          width="16"
                        />
                        1405 E. Lake Ave. Peoria Heights Illinois 61616 United States
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {
              (isShowBtn)
                ? (
                  <div className="col-sm-4 col-lg-3 col-md-3 footer-widget-block get-app-widget">
                    <div className="list-unstyled clear-margins">
                      <div className="footer-widget">
                        <h1 className="title">Quick access</h1>
                        <p>Get a DLD Vip Mobile Application</p>
                        <div className="footer-get-app">
                          <InstallButton deferredPrompt={deferredPrompt}/>
                        </div>
                      </div>
                    </div>
                  </div>
                )
                : null
            }

            <div className="col-sm-6 col-lg-4 col-md-4 footer-widget-block subscribe-widget">
              <div className="list-unstyled clear-margins">
                <div className="footer-widget">
                  <h1 className="title">Subscribe</h1>
                  <p>Be the first to know about our promotions, sales and discounts</p>
                  <div className="footer-address-section">
                    <ul className="list-unstyled link-list">
                      <li className="subscription">
                        <NewsLetter/>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="design-by">
              <span>2019 © dldvip All Rights Reserved.</span>
            </div>
            <div className="footer-social-media">
              <ul className="list-unstyled link-list">
                <li>
                  <span>Join our Facebook group!</span>
                  <a href={social.FACEBOOK_PAGE_URL} title="Our facebook page" className="facebook-contain"
                     target="_blank" rel="noopener noreferrer">
                  </a>
                </li>
                <li>
                  <span>Follow our Facebook page!</span>
                  <a href={social.FACEBOOK_GROUP_URL} title="Our facebook group"
                     className="facebook-outline" target="_blank" rel="noopener noreferrer">
                  </a>
                </li>
                <li>
                  <span>Follow us in</span>
                  <a href={social.INSTAGRAM_URL} title="Instagram" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-instagram" aria-hidden="true"></i>
                  </a>
                  <a href={social.TWITTER_URL} title="Twitter" className="twitter" target="_blank"
                     rel="noopener noreferrer">
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Footer;
