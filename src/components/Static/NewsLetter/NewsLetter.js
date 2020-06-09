import React, { Component } from 'react';
import * as Style from './NewsLetter.css';
import { ApiHelper } from '../../../helpers/ApiHelper';

class NewsLetter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			successBox: 'display_hide',
			successMessage: 'You have been successfully subscribed to the newsletter',
			errorBox: 'display_hide',
			errorMessage: 'You’re Already Subscribed!',
			formBox: '',
			emailField: '',
			isLoading: false
		};
	}

	handleSubmit = async (e) => {
		let api = new ApiHelper();
		e.preventDefault();
		// api will call here
		if (this.state.emailField === '') {
			this.setState({ errorBox: '' });
			this.setState({ errorMessage: 'Email is Required' });
			return;
		} else {
			this.setState({ errorBox: 'display_hide', errorMessage: '' });
		}

		var emailValid = this.state.emailField.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
		if (emailValid) {
			this.setState({ isLoading: true });
			let data = { email: this.state.emailField };
			let result = await api.FetchFromServer('/', 'newsletter', 'POST', true, undefined, data);
			if (result.isError) {
				this.setState({ isLoading: false, errorBox: '', errorMessage: result.messages[0]})
			} else {
				this.setState({
					isLoading: false,
					formBox: 'display_hide',
					successBox: '',
					successMessage: this.state.successMessage
				});
			}
		} else {
			this.setState({ errorBox: '' });
			this.setState({ errorMessage: 'Email is Not Valid' });
		}
	};

	emailHandler = (e) => {
		this.setState({
			errorBox: 'display_hide',
			errorMessage: '',
			emailField: e.target.value
		});
	};

	render() {
		const { isLoading } = this.state;
		return (
			<div className="subscriptionBox">
				<div className={Style[this.state.successBox] + ' ' + Style.successClass}>
					{this.state.successMessage}
				</div>
				<div className={Style[this.state.formBox]}>
					<form method="post" onSubmit={this.handleSubmit}>
						<p className={Style[this.state.errorBox] + ' ' + Style.errorClass}>{this.state.errorMessage}</p>
						<div className="input-group">
							<input
								className="form-control"
								name="emailField"
								id="emailfooter"
								placeholder="Enter your email"
								type="text"
								onChange={this.emailHandler}
							/>
							<span className="input-group-btn">
								{ isLoading === true ?
									<button className="btn btn-default flash-effect" id="btnsubmit" type="submit" disabled>
										Loading ...
									</button>
								:
									<button className="btn btn-default flash-effect" id="btnsubmit" type="submit" >
										+
									</button>
								}
							</span>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default NewsLetter;
