import React,{Component} from 'react';
import {Navbar} from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import Constant from '../../config/Constant';
import { connect } from "react-redux";

// import Menu, {SubMenu, MenuItem as MenuRc} from 'rc-menu';
import { profileInfoRequest, logOutRequest, cartListWithoutLoginRequest, cartListWithLoginRequest } from '../../actions';

class HeaderCheckout extends Component {
  constructor(props){
    super(props);
    this.state={
      loggedIn: false,
      showUserProfileDropdown:false,
      showMenuDropdown:false
    }
  }

  componentWillMount() {    
    const storageSession=JSON.parse(localStorage.getItem('localStorageVal')); 
    if(storageSession)
    {
      this.props.profileInfoAction();
      this.props.cartDataWithLogin();
     
    }
    else {
      this.props.cartData();  
    }
  }


  render() {    
    //const { cartDataState } = this.props;
    return (
      <Navbar collapseOnSelect fluid={true} className="header-custom headerCheckout">
        <div className="header-flex">
          <Navbar.Header>
          <NavLink to="/">
            <div className="brand-custom-checkout">
                <img src={Constant.frontUrl+"/assets/img/DLD_VIP_LOGO_WHITE.png"} alt="DLD_VIP_LOGO"/>
            </div>
          </NavLink>
          </Navbar.Header>
                 
        </div>
    </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      loginState: state.loginReducer,
      cartDataState: state.cartListWithoutLoginReducer,
  };
}


const mapDispatchProps = (dispatch) => {
    return {
      profileInfoAction: () => {
        dispatch(profileInfoRequest());
      },
      logOutAction: () => {
        dispatch(logOutRequest());
      },
      cartData: () => {
        dispatch(cartListWithoutLoginRequest());
      },	
      cartDataWithLogin: () => {
          dispatch(cartListWithLoginRequest());
      },
  }
}
export default connect(mapStateToProps , mapDispatchProps)(HeaderCheckout);