import React, { Component } from 'react';
import { ApiHelper } from '../../../helpers/ApiHelper';
import { ToastStore } from 'react-toasts';
import { Loader } from "../../Static/Common/Loader/Loader";
import { validation } from '../../../config/validationError';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            emailErrMsg: '',
            emaildErrClass: 'display_none',
            isLoading: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange = (event) => {
        event.preventDefault();
        this.setState({ email: event.target.value })
    }
    async handleSubmit(event) {
        const {
            forgotPasswordClose,
        } = this.props;

        event.preventDefault();

        var emailRegex = this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        if (this.state.email === "") {
            this.setState({
                emailErrMsg: validation.emailValidation,
                emaildErrClass: 'show_block'
            });
            return
        }
        if (emailRegex) {
            this.setState({ emaildErrClass: 'display_none', emailErrMsg: '' });
        }
        else {
            this.setState({
                emailErrMsg: validation.emailInvalid,
                emaildErrClass: 'show_block'
            });
            return;
        }
        var data = {
            email: this.state.email
        }
        this.setState({isLoading: true});
        let api = new ApiHelper();
        let result = await api.FetchFromServer('/',
            'user/forgotPassword',
            'POST',
            false,
            undefined,
            data
        );
        this.setState({disableForgotpass: true})
        if (result.isError) {
            setTimeout(() => {
                this.setState({disableForgotpass: false})
            }, 3000);
            this.setState({isLoading: false});
            ToastStore.error(result.messages[0]);
            return;
        }
        else {
            setTimeout(() => {
                this.setState({disableForgotpass: false})
            }, 3000);
            this.setState({isLoading: false});
            ToastStore.success(result.data.message);
            forgotPasswordClose();
        }
        this.setState({ email: "" })
    }

    render() {
        const { forgotPasswordClose } = this.props;
        return (
            <div className="form-forgot-pw">
                <div className="form-forgot-header">
                    <h3>Forgot Password?</h3>
                    <p>Enter the email address associated with your DLD VIP account</p>
                </div>
                <div className="clearfix form-block">
                {
                    this.state.isLoading ?
                    <Loader/> : null
                }
                    <form id="loginform">
                        <div className="form-group">
                            <label for="Email">Email<span className="mandatory">*</span></label>
                            <input type="email" className="form-control" id="Email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="john@example.com" />
                            <div className={this.state.emaildErrClass + " error-msg"}>{this.state.emailErrMsg}</div>
                        </div>
                        <div className="form-group form-button">
                            {
                                this.state.disableForgotpass ?
                                <button id="submit" type="submit" className="btn-effect one" disabled>Please Wait...</button> :
                                <button id="submit" type="submit" className="btn-effect one" onClick={this.handleSubmit}>Submit</button>
                            }
                        </div>
                    </form>
                </div>
                <div className="links">
                    <p>Remember your password?
                        <span onClick={forgotPasswordClose}>Sign In</span>
                    </p>
            </div>
            </div>

        );
    }
}

export default ForgotPassword;
