import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Constant from '../../../config/Constant';
class NotFound extends Component {

  render() {
    return (      
		<div className="notfound-page">
			<div class="container">
				<div class="row">
					<div class="col-xs-12 col-sm-6 col-md-6">
						<div class="error-img">
                			<img src={Constant.frontUrl+"/assets/img/404.svg"} alt=""/>
						</div>
					</div>
					<div class="col-xs-12 col-sm-6 col-md-6">
						<div class="error-content">
							<h1 class="noresult-img">!</h1>
							<h2>404 Not Found</h2>
							<div class="error-details">
							Sorry, an error has occurred. Requested page not found!                    
							</div>
							<div class="error-actions">
							<NavLink to="/" class="btn btn-effect one btn-lg"><i class="fa fa-home" aria-hidden="true"></i> Return To Home </NavLink>
							{/* <NavLink to="/" class="btn btn-effect one btn-lg"><i class="fa fa-envelope" aria-hidden="true"></i> Contact Us </NavLink> */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>          
    );
  }
}

export default NotFound;
