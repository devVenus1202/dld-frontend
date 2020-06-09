import React, { Component } from 'react';
import { Loader } from "../../Static/Common/Loader/Loader";
// import GoogleLoginPage from "../Social/GoogleLoginPage";
// import FaceBookLoginPage from "../Social/FaceBookLoginPage";
import {validation} from "../../../config/validationError";

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            contactNumber: '',
            email: '',
            password: '',
            confirmPassword: '',
            firstNameErrMsg: '',
            lastNameErrMsg: '',
            emailErrMsg: '',
            contactErrMsg: '',
            passwordErrMsg: '',
            conPasswordErrMsg: '',
            firstNameErrClass: 'display_none',
            lastNameErrClass: 'display_none',
            emailErrClass: 'display_none',
            contactErrClass: 'display_none',
            passwordErrClass: 'display_none',
            conPasswordErrClass: 'display_none'
        }
    }
    handleFirstNameChange = (e) => {
        let firstName = e.target.value;
        this.setState({ firstName });
    }
    handleLastNameChange = (e) => {
        let lastName = e.target.value;
        this.setState({ lastName });

    }
    handleEmailChange = (e) => {
         if (!e.isTrusted) return;
        let email = e.target.value.replace(/\s/g, "");
        this.setState({ email });
    }
    handleContactChange = (e) => {
        let contactNumber = e.target.value;
        if (isNaN(contactNumber)) {
            return;
        }
        else {
            this.setState({ contactNumber });
        }
    }
    handlePasswordChange = (e) => {
        let password = e.target.value;
        var passwordRegex = password.match(/^\s+$/);
        if (!passwordRegex) {
            this.setState({ password });
        }
        else {
            return;
        }

    }
    handleConfirmPasswordChange = (e) => {
        let confirmPassword = e.target.value;
        this.setState({ confirmPassword });
    }
    handleSignup = (event) => {
        const {
            handleAuthClose,
        } = this.props;
        event.preventDefault();
        var nameRegex = this.state.firstName.match(/^[a-zA-Z][a-zA-Z\s]*$/);
        if (this.state.firstName === '') {
            this.setState({
                firstNameErrMsg: validation.firstName,
                firstNameErrClass: ''
            });
            return;
        }
        else if (!nameRegex) {
            this.setState({
                firstNameErrMsg: validation.firstnameLetter,
                firstNameErrClass: ''
            });
            return;
        }
        else {
            this.setState({
                firstNameErrMsg: '',
                firstNameErrClass: 'display_none'
            });
        }
        var lastNameRegex = this.state.lastName.match(/^[a-zA-Z][a-zA-Z\s]*$/);
        if (this.state.lastName === '') {
            this.setState({
                lastNameErrMsg: validation.lastName,
                lastNameErrClass: ''
            });
            return;
        }
        else if (!lastNameRegex) {
            this.setState({
                lastNameErrMsg: validation.lastnameLetter,
                lastNameErrClass: ''
            });
            return;
        }
        else {
            this.setState({
                lastNameErrMsg: '',
                lastNameErrClass: 'display_none'
            });
        }
        var emailRegex = this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        if (this.state.email === '') {
            this.setState({
                emailErrMsg: validation.emailValidation,
                emailErrClass:''
            });
            return;
        }
        else if (!emailRegex) {
            this.setState({
                emailErrMsg: validation.emailInvalid,
                emailErrClass:''
            });
            return;
        }
        else {
            this.setState({
                emailErrMsg: '',
                emailErrClass: 'display_none'
        });
        }
        var contactRegex = this.state.contactNumber.match(/^\d{7,14}$/);
        if (this.state.contactNumber === '') {
            this.setState({
                contactErrMsg: validation.numberValidation,
                contactErrClass: ''
            });
            return;
        }
        else if (!contactRegex) {
            this.setState({
                contactErrMsg: validation.numberInvalid,
                contactErrClass: ''
            });
            return;
        }
        else {
            this.setState({
                contactErrMsg: '',
                contactErrClass: 'display_none'
            });
        }
        if (this.state.password === '') {
            this.setState({
                passwordErrMsg: validation.passwordValidation,
                passwordErrClass: ''
            });
            return;
        }
        else if (this.state.password.length < 6) {
            this.setState({
                passwordErrMsg: validation.minimumPasswordValidation,
                passwordErrClass: ''
            });
            return;
        }
        else {
            this.setState({
                passwordErrMsg: '',
                passwordErrClass: 'display_none'
            });
        }
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({
                conPasswordErrMsg: validation.confirmPassword,
                conPasswordErrClass: 'display_block'
            });
            return;
        }
        else {
            this.setState({
                conPasswordErrMsg: '',
                conPasswordErrClass: 'display_none'
            });
        }
        const data = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            contactNumber: this.state.contactNumber,
            email: this.state.email,
            password: this.state.password,
            handleAuthClose,
        }
        this.setState({disableSignup: true})
        this.props.signUpAction(data);
        setTimeout(() => {
            this.setState({disableSignup: false})
        }, 4000);
    }
    render() {
        const { signUpState } = this.props;
        return (
            <div className="form-items">
            {
                signUpState.isSigningUp ?
                <Loader /> :
                null
            }
                <div className="clearfix form-block">
                    <form id="loginform" onSubmit={this.handleSignup}>
                        <div className="form-flexed-row">
                            <div className="form-group">
                                <label htmlFor="Name">First Name <span className="mandatory">*</span></label>
                                <input type="text" className="form-control" id="Name" name="firstName" placeholder="John" value={this.state.firstName} onChange={this.handleFirstNameChange} autocomplete="new-firstName"/>
                                <div className={this.state.firstNameErrClass + " error-msg"}>{this.state.firstNameErrMsg}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name <span className="mandatory">*</span></label>
                                <input type="text" className="form-control" id="lastName" name="lastName" placeholder="Doe" value={this.state.lastName} onChange={this.handleLastNameChange} autocomplete="new-lastName"/>
                                <div className={this.state.lastNameErrClass + "error-msg"}>{this.state.lastNameErrMsg}</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="Email">Email<span className="mandatory">*</span></label>
                            <input type="text" className="form-control" id="Email" name="email" placeholder="john@example.com" value={this.state.email} onChange={this.handleEmailChange} autocomplete="new-email"/>
                            <div className={this.state.emailErrClass + " error-msg"}>{this.state.emailErrMsg}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="number">Mobile Number <span className="mandatory">*</span></label>
                            <input type="text" className="form-control" id="number" name="contactNumber" placeholder="xxxxxxxxxx" value={this.state.contactNumber} onChange={this.handleContactChange} maxLength={14} autocomplete="new-number"/>
                            <div className={this.state.contactErrClass + " error-msg"}>{this.state.contactErrMsg}</div>
                        </div>
                        <div className="form-flexed-row">
                            <div className="form-group">
                                <label htmlFor="Password">Password <span className="mandatory">*</span></label>
                                <input type="password" className="form-control" id="Password" name="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange} autocomplete="new-password"/>
                                <div className={this.state.passwordErrClass + " error-msg"}>{this.state.passwordErrMsg}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="re-password">Confirm Password <span className="mandatory">*</span></label>
                                <input type="password" className="form-control" id="re-password" name="confirmPassword" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.handleConfirmPasswordChange} autocomplete="conf-password"/>
                                <div className={this.state.conPasswordErrClass + " error-msg"}>{this.state.conPasswordErrMsg}</div>
                        </div>
                        </div>
                        <div className="form-group form-button">
                            {
                                signUpState.isSigningUp || this.state.disableSignup?
                                    <button id="submit" type="submit" className="btn-effect one" disabled>Please Wait..</button> :
                                    <button id="submit" type="submit" className="btn-effect one">Create Account</button>
                            }
                        </div>
                    </form>
                </div>
                {/*<div className="height25"></div>*/}
                  {/*<div className="divider-with-text"> <span>OR</span> </div>*/}
                  {/*<div className="social-login-btn-wrap">*/}
                    {/*<GoogleLoginPage responseGoogle={this.responseGoogle}/>*/}
                    {/*<FaceBookLoginPage />*/}
                {/*</div>*/}
            </div>
        )
    }
}

export default Signup;
