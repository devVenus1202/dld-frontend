import React, { Component } from 'react';
import { AppConfig } from '../../../config/AppConfig';
import { ApiHelper } from '../../../helpers/ApiHelper';
// import { ToastStore } from 'react-toasts';
import qs from "query-string";
import {Link} from 'react-router-dom';
import { Loader } from "../../Static/Common/Loader/Loader";
import {validation} from "../../../config/validationError";

class ResetPassword extends Component {

	constructor(props) {
		super(props);
		this.state = {
			tokenVerified: false,
			user: "",
			token: "",
			email: "",
			id: "",
			verification: "",
			message: '',
			displaytext: 'display_none',
			newPassword: "",
			confirmPassword: "",
			newPasswordErrClass: 'display_none',
			confirmPasswordErrClass: 'display_none',
			newPasswordErrMsg: "",
			confirmPasswordErrMSg: "",
			formBox: '',
			successBox: 'display_none',
			isLoading: false
			
		}
	}

	async componentDidMount () {
		const { location } = this.props;
      	const { search } = location;
		let user = qs.parse(search).user;
		let verification = qs.parse(search).verification;
		let token = qs.parse(search).token;
		let data = {
			user: user,
			verification: verification,
			token: token
		}	
		this.setState({
			user: user,
			verification: verification,
			token: token,
			isLoading: true
		});
		let api = new ApiHelper();
		let result = await api.FetchFromServer('/',
			'user/verifiedLink',
			'GET',
			false,
			data,
			undefined
		);
		if(result.isError) {
			this.setState({
				displaytext: '',
				message: validation.sessionExpire,
				isLoading: false
			});
		}
		else {
			let dataValue = result.data.data;
		
			this.setState({
				email: dataValue.email,
				id: dataValue.id,
				tokenVerified: true,
				isLoading: false
			});
		}
	}

	async handleReset(e){			
		e.preventDefault();
		const {
			newPassword,
			confirmPassword
		} = this.state
		if (!this.state.tokenVerified) {
			//alert("token has been Expired");
			this.setState({
				displaytext: '',
				message: validation.tokeExpire
			})
			return;
		}
		if (newPassword === '') {
			this.setState({
				newPasswordErrMsg: validation.passwordValidation,
				newPasswordErrClass: ''
			});
			return;
		}
		else if (newPassword.length < 6) {
			this.setState({
				newPasswordErrMsg: validation.minimumPasswordValidation,
				newPasswordErrClass: ''
			});
			return;
		} else {
			this.setState({
				newPasswordErrMsg: '',
				newPasswordErrClass: 'display_none'
			});
		}
		if (confirmPassword === "") {
			this.setState({
				confirmPasswordErrMsg: validation.confirmPassword,
				confirmPasswordErrClass: ''
			});
			return;
		}
		if (newPassword !== confirmPassword) {
			this.setState({
				confirmPasswordErrMsg: validation.confirmPassword,
				confirmPasswordErrClass: ''
			});
			return;
		} else {
			this.setState({
				confirmPasswordErrMsg: '',
				confirmPasswordErrClass: 'display_none'
			});
		}

	
		let api = new ApiHelper();
		let dataValue = {
			email: this.state.email,
			id: this.state.id,
			password: this.state.newPassword,
			verifyToken: this.state.token
		}
		this.setState({isLoading: true});
		let result = await api.FetchFromServer('/',
			'user/resetPassword',
			'PUT',
			false,
			undefined,
			dataValue
		);
		if(result.isError) {
			this.setState({isLoading: false});
			this.setState({
				displaytext: '',
				message: validation.tokeExpire
			})
		}
		else {
			this.setState({isLoading: false});
			this.setState({
				newPassword: '',
				confirmPassword: '',
				successBox: '',
				formBox: 'display_none'
			})
		}
		
	}

	handleChange = (e) => {
		this.setState({
			displaytext: 'display_none',
			message: ''
		})
		this.setState({
			[e.target.name]: e.target.value
		});
	}
  render() {
    return (
      	<section className="login-wrapper">
	      	<div className="form-body without-side">
			    <div className="row">
			        <div className="img-holder">
			            <div className="bg"></div>
			        </div>
			        <div className="form-holder">
			            <div className="form-content">
							<div className="website-logo">
								<a href="/login">
									<div className="logo">
										<img className="logo-size" src={AppConfig.frontUrl+"/assets/img/DLD_VIP_LOGO_WHITE.png"} alt="DLD_VIP_LOGO"/>
									</div>
								</a>
							</div>
			                <div className="form-items">
			                	<div className="form-modal-header">
			                    	<h3>Reset Password</h3>
			                    	<p>With your dld vip Account</p>
			                    </div>
			                    <div className="clearfix form-block">
									<div className={this.state.formBox}>
									{
										this.state.isLoading ? 
										<Loader/> : null
									}
										<form id="loginform" onSubmit = {this.handleReset.bind(this)}>
											<div className={this.state.displaytext+ " link-expired"} >{this.state.message}</div>
											<div className="form-group">
												<label for="Password">New Password <span class="mandatory">*</span></label>
												<input type="password" className="form-control" id="Password" name="newPassword" value={this.state.newPassword} onChange={this.handleChange} />
												<div className={this.state.newPasswordErrClass + " error-msg"}>{this.state.newPasswordErrMsg}</div>
											</div>
											<div className="form-group">
												<label for="Password">Confirm Password <span class="mandatory">*</span></label>
												<input type="password" className="form-control" id="Password" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} />
												<div className={this.state.confirmPasswordErrClass + " error-msg"}>{this.state.confirmPasswordErrMsg}</div>
											</div>

											<div className="form-group form-button">
												{
													this.state.displaytext !== "" ?
													<button id="submit" type="submit" className="btn-effect one" >Submit</button>
													:
													<button id="submit" disabled type="submit" className="btn-effect one" >Submit</button>
												}													
											</div>
										</form>
										 <div className="page-links footer-link">
			                        <span>If you have remember?</span> <Link to ="/login">Sign In</Link>
			                    </div>
									</div>
									<div className={this.state.successBox}>
										<div class="reset-page-block-up">
											<div class="reset-page-img">
												<img class="" src={AppConfig.frontUrl +"/assets/img/icons/thank-page-icon.svg"} alt=""/>
											</div>
											<h4 class="reset-page-heading">Password has been reset successfully!</h4>
											<hr className="success-line"/>
											<div className="text-center">
												<button id="Login" className="btn-effect btn" > <Link to ="/login" className="reset-login-btn">Login</Link></button>
											</div>
										</div>
									</div>
			                    </div>
			               </div>
			            </div>
			        </div>
			    </div>
			</div>
      	</section>
    );
  }
}

export default ResetPassword;
