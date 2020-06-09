import React, { Component } from "react";
import { Link } from "react-router-dom";
// import GoogleLoginPage from "../../../Auth/Social/GoogleLoginPage";
// import FaceBookLoginPage from "../../../Auth/Social/FaceBookLoginPage";
import {validation} from "../../../../config/validationError";

class LoginModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1,
      email: "",
      password: "",
      errorClass: "display_none",
      errorClassEmail: "display_none",
      errorClassPassword: "display_none",
      errorMsgEmail: "Error",
      errorMsgPassword: "Error",
      errorMessage: ""
    };
  }
  handleSelect = key => {
    this.setState({ key });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  updateEmail(e) {
    this.setState({ email: e.target.value.replace(/\s/g, "") });
  }

  updatePassword(e) {
    this.setState({ password: e.target.value });
  }
  handleHide = () => {
    this.props.displayLoginTrigger(false);
  };

  handleSubmit = event => {
    event.preventDefault();

    if (this.state.email === "") {
      this.setState({ errorClassEmail: "show_block" });
      this.setState({ errorMsgEmail: validation.emailValidation });
      return;
    } else {
      this.setState({ errorClassEmail: "display_none", errorMsgEmail: "" });
    }

    var emailValid = this.state.email.match(
      /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
    );
    if (emailValid) {
      if (this.state.password === "") {
        this.setState({ errorClassPassword: "show_block" });
        this.setState({ errorMsgPassword: validation.passwordValidation });
        return;
      } else {
        this.setState({
          errorClassPassword: "display_none",
          errorMsgPassword: ""
        });
      }
      const objectData = {
        email: this.state.email,
        password: this.state.password,
        asAGuest: this.props.AsAGuest
      };
      this.setState({isLoginDisabled : true})
      this.props.LoginModel(objectData);
      setTimeout(() => {
        this.setState({isLoginDisabled : false})  
      }, 3000);
    } else {
      this.setState({ errorClassEmail: "show_block" });
      this.setState({ errorMsgEmail: validation.emailInvalid });
      return;
    }
  };

  responseGoogle = (response) => {
    this.props.responseGoogle(response);
  }
  render() {
    return (
      <div className="modal-form-items">
        <form id="loginform" className="authModelLogin" method="POST" onSubmit={this.handleSubmit}>
          <div className={this.state.errorClass + " error-msg"}>
            {this.state.errorMessage}
          </div>
          <div className="form-group">
            <label htmlFor="Email">Email</label>
            <input
              type="text"
              className="form-control"
              id="Email_Login"
              name="email"
              placeholder="john@example.com"
              autoComplete={"new-password"}
              onChange={this.updateEmail.bind(this)}
              value={this.state.email}
            />
            <div className={this.state.errorClassEmail + " error-msg"}>
              {this.state.errorMsgEmail}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              className="form-control"
              id="Password_Login"
              name="password"
              placeholder="******"
              autoComplete={"new-password"}
              onChange={this.updatePassword.bind(this)}
            />
            <div className={this.state.errorClassPassword + " error-msg"}>
              {this.state.errorMsgPassword}
            </div>
          </div>
          <div className="form-button submit-forget-wrap ">
          {
            this.state.isLoginDisabled ? 
            <button disabled className="btn-effect one">
              Please Wait..
            </button>  :
            
            <button id="submit" type="submit" className="btn-effect one">
              Sign In
            </button>
          }        
          <Link to="/forgot-password">Forgot password?</Link>  
          </div>
          {/* <div className="page-links footer-link">
            <span>Don't have an account?</span>{" "}
            <Link to="/signup">Sign Up</Link>
          </div> */}
          {/* <div className="social-login-btn-wrap">
            <GoogleLoginPage responseGoogle={this.responseGoogle} />
          </div>           */}
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

export default LoginModel;
