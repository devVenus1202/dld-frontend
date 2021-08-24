import React, { Component } from "react";
// import GoogleLoginPage from "../../../Auth/Social/GoogleLoginPage";
// import FaceBookLoginPage from "../../../Auth/Social/FaceBookLoginPage";
import {validation} from "../../../../config/validationError";

class RegistrationModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstNameErrMsg: "",
      lastNameErrMsg: "",
      emailErrMsg: "",
      contactErrMsg: "",
      passwordErrMsg: "",
      conPasswordErrMsg: "",
      firstNameErrClass: "display_none",
      lastNameErrClass: "display_none",
      emailErrClass: "display_none",
      contactErrClass: "display_none",
      passwordErrClass: "display_none",
      conPasswordErrClass: "display_none"
    };
  }

  handleFirstNameChange = e => {
    let firstName = e.target.value;
    this.setState({ firstName });
  };
  handleLastNameChange = e => {
    let lastName = e.target.value;
    this.setState({ lastName });
  };
  handleEmailChange = e => {
    let email = e.target.value.replace(/\s/g, "");
    this.setState({ email });
  };
  handleContactChange = e => {
    let contactNumber = e.target.value;
    if (isNaN(contactNumber)) {
      return;
    } else {
      this.setState({ contactNumber });
    }
  };
  handlePasswordChange = e => {
    let password = e.target.value;
    var passwordRegex = password.match(/^\s+$/);
    if (!passwordRegex) {
      this.setState({ password });
    } else {
      return;
    }
  };
  handleConfirmPasswordChange = e => {
    let confirmPassword = e.target.value;
    this.setState({ confirmPassword });
  };

  handleSignup = event => {
    event.preventDefault();
    var nameRegex = this.state.firstName.match(/^[a-zA-Z][a-zA-Z\s]*$/);
    if (this.state.firstName === "") {
      this.setState({
        firstNameErrMsg: validation.firstName,
        firstNameErrClass: ""
      });
      return;
    } else if (!nameRegex) {
      this.setState({
        firstNameErrMsg:  validation.firstnameLetter,
        firstNameErrClass: ""
      });
      return;
    } else {
      this.setState({
        firstNameErrMsg: "",
        firstNameErrClass: "display_none"
      });
    }
    var lastNameRegex = this.state.lastName.match(/^[a-zA-Z][a-zA-Z\s]*$/);
    if (this.state.lastName === "") {
      this.setState({
        lastNameErrMsg: validation.lastName,
        lastNameErrClass: ""
      });
      return;
    } else if (!lastNameRegex) {
      this.setState({
        lastNameErrMsg: validation.lastnameLetter,
        lastNameErrClass: ""
      });
      return;
    } else {
      this.setState({
        lastNameErrMsg: "",
        lastNameErrClass: "display_none"
      });
    }
    var emailRegex = this.state.email.match(
      /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
    );
    if (this.state.email === "") {
      this.setState({
        emailErrMsg: validation.emailValidation,
        emailErrClass: ""
      });
      return;
    } else if (!emailRegex) {
      this.setState({
        emailErrMsg: validation.emailInvalid,
        emailErrClass: ""
      });
      return;
    } else {
      this.setState({
        emailErrMsg: "",
        emailErrClass: "display_none"
      });
    }
    var contactRegex = this.state.contactNumber.match(/^\d{7,14}$/);
    if (this.state.contactNumber === "") {
      this.setState({
        contactErrMsg: validation.numberValidation,
        contactErrClass: ""
      });
      return;
    } else if (!contactRegex) {
      this.setState({
        contactErrMsg: validation.numberInvalid,
        contactErrClass: ""
      });
      return;
    } else {
      this.setState({
        contactErrMsg: "",
        contactErrClass: "display_none"
      });
    }
    if (this.state.password === "") {
      this.setState({
        passwordErrMsg: validation.passwordValidation,
        passwordErrClass: ""
      });
      return;
    } else if (this.state.password.length < 6) {
      this.setState({
        passwordErrMsg: validation.minimumPasswordValidation,
        passwordErrClass: ""
      });
      return;
    } else {
      this.setState({
        passwordErrMsg: "",
        passwordErrClass: "display_none"
      });
    }
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        conPasswordErrMsg: validation.confirmPassword,
        conPasswordErrClass: "display_block"
      });
      return;
    } else {
      this.setState({
        conPasswordErrMsg: "",
        conPasswordErrClass: "display_none"
      });
    }
    const data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      contactNumber: this.state.contactNumber,
      email: this.state.email,
      password: this.state.password,
      asAGuest: this.props.AsAGuest
    };
    this.setState({isSignupDisabled: true})
    this.props.RegistrationModel(data);
    setTimeout(() => {
      this.setState({isSignupDisabled: false})
    }, 3000);
  };

  render() {
    return (
      <div className="modal-form-items">
        <form id="registrationform" method="POST" onSubmit={this.handleSignup}>
          <div className="form-group fName col-md-6">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              id="FName"
              name="fname"
              placeholder="John"
              value={this.state.firstName}
              autoComplete={"fname-false"}
              onChange={this.handleFirstNameChange}
            />
            <div className={this.state.firstNameErrClass + " error-msg"}>
              {this.state.firstNameErrMsg}
            </div>
          </div>
          <div className="form-group lName col-md-6">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              id="LName"
              name="lname"
              placeholder="Doe"
              value={this.state.lastName}
              autoComplete={"lname-false"}
              onChange={this.handleLastNameChange}
            />
            <div className={this.state.lastNameErrClass + "error-msg"}>
              {this.state.lastNameErrMsg}
            </div>
          </div>
          <div className="clearfix" />
          <div className="form-group">
            <label htmlFor="Email">Email</label>
            <input
              type="text"
              className="form-control"
              id="Email"
              name="email"
              placeholder="john@example.com"
              value={this.state.email}
              onChange={this.handleEmailChange}
            />
            <div className={this.state.emailErrClass + " error-msg"}>
              {this.state.emailErrMsg}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="Email">Mobile number</label>
            <input
              type="text"
              className="form-control"
              id="number"
              name="number"
              placeholder="xxxxxxxxxx"
              maxLength= '14'
              value={this.state.contactNumber}
              autoComplete={"email-false"}
              onChange={this.handleContactChange}
            />
            <div className={this.state.contactErrClass + " error-msg"}>
              {this.state.contactErrMsg}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              className="form-control"
              id="Password_new"
              name="password"
              placeholder="******"
              value={this.state.password}
              autoComplete={"password-false"}
              onChange={this.handlePasswordChange}
            />
            <div className={this.state.passwordErrClass + " error-msg"}>
              {this.state.passwordErrMsg}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="Password">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="Password_confir"
              name="password"
              placeholder="Confirm Password"
              value={this.state.confirmPassword}
              autoComplete={"confirm-password-false"}
              onChange={this.handleConfirmPasswordChange}
            />
            <div className={this.state.conPasswordErrClass + " error-msg"}>
              {this.state.conPasswordErrMsg}
            </div>
          </div>
          <div className="form-button text-center">
          {
            this.state.isSignupDisabled ?  <button
              disabled
              className="btn-effect one"
            >
              Please Wait...
            </button> :   <button
              id="submit_registration"
              type="submit"
              className="btn-effect one"
            >
              Sign Up
            </button>
          }
          </div>
        </form>
        <div className="height25"></div>
          {/*<div className="divider-with-text"> <span>OR</span> </div>*/}
          {/*<div className="social-login-btn-wrap">*/}
            {/*<GoogleLoginPage responseGoogle={this.responseGoogle}/>*/}
            {/*<FaceBookLoginPage />*/}
        {/*</div>*/}
      </div>
    );
  }
}

export default RegistrationModel;
