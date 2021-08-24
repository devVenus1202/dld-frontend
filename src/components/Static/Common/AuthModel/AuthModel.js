import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Tabs, Tab } from "react-bootstrap";
import LoginModel from "./LoginModel";
import RegistrationModel from "./RegistrationModel";
import Guest from "./Guest";
class AuthModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1
    };
  }
  handleSelect = key => {
    this.setState({ key });
  };
  handleHide = () => {
    this.props.displayLoginTrigger(false);
  };

  loginModelHandler = data => {
    this.props.loginFun(data);
  };

  registrationModelHandler = data => {
    this.props.registratioFun(data);
  };

  checkoutRedirectionFun = data => {
    this.props.checkoutRedirection(data);
  }

  responseGoogle = (response) => {
    this.props.responseGoogle(response);
  }

  render() {
    const asAGuset = this.props.status === "webinar" ? false : true;
    const { giftCardRedirection } = this.props;
    return (
      <Modal
        show={this.props ? this.props.displayLoginModel : false}
        onHide={this.handleHide}
        className={asAGuset ? "authguestwidth" : "authmodal"}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">
            Process Your Accounts
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            activeKey={this.state.key}
            onSelect={this.handleSelect}
            id="controlled-tab-example"
            className="custom-tab-wrap"
          >
            <Tab
              eventKey={1}
              title="Sign In"
              tabClassName={asAGuset ? "guestwidth" : ""}
            >
              <LoginModel
                LoginModel={this.loginModelHandler}
                AsAGuest={asAGuset}
                responseGoogle= {this.responseGoogle}
              />
            </Tab>
            <Tab
              eventKey={2}
              title="Sign Up"
              tabClassName={asAGuset ? "guestwidth" : ""}
            >
              <RegistrationModel
                RegistrationModel={this.registrationModelHandler}
                AsAGuest={asAGuset}
              />
            </Tab>
            {asAGuset ? (
              <Tab
                eventKey={3}
                title="Continue as Guest"
                tabClassName="guestTab"
              >
              {
                giftCardRedirection ?
                <Guest Guest={this.GuestHandler} AsAGuest={asAGuset}  giftCardRedirection = {this.props.giftCardRedirection} checkoutRedirection = {this.checkoutRedirectionFun}/>
                :
                <Guest Guest={this.GuestHandler} AsAGuest={asAGuset}  />
              }
                
              </Tab>
            ) : null}
          </Tabs>
        </Modal.Body>
      </Modal>
    );
  }
}

export default AuthModel;
