import React, { Component } from "react";
import Constant from "../../../config/Constant";
import LeftSidebar, { LeftSidebarMobileView	} from "./LeftSidebar";
import { ApiHelper } from "./../../../helpers/ApiHelper";
import { ToastStore } from "react-toasts";
import { Loader } from "../../Static/Common/Loader/Loader";
import { updateToken } from "../../../helpers/user";

class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      postalCode: "",
      country: "231",
      state: "",
      city: "",
      address: "",
      errorMsgFirstName: "Error",
      errorClassFirstName: "display_none",
      errorMsgLastName: "Error",
      errorClassLastName: "display_none",
      errorMsgMobile: "Error",
      errorClassMobile: "display_none",
      errorMsgEmail: "Error",
      errorClassEmail: "display_none",
      errorMsgCountry: "Error",
      errorClassCountry: "display_none",
      errorMsgState: "Error",
      errorClassState: "display_none",
      errorMsgCity: "Error",
      errorClassCity: "display_none",
      errorMsgPostalCode: "Error",
      errorClassPostalCode: "display_none",
      errorMsgAddress: "Error",
      errorClassAddress: "display_none",
      errorMsgAddress2: "Error",
      errorClassAddress2: "display_none",
      countryData: [],
      cityData: [],
      isLoading: false,
      address2: "",
    };
  }
  updateFirstName(e) {
    this.setState({ firstName: e.target.value });
  }
  updateLastName(e) {
    this.setState({ lastName: e.target.value });
  }
  updateMobile(e) {
    if (isNaN(e.target.value)) {
      return;
    }
    this.setState({ contactNumber: e.target.value });
  }
  updateEmail(e) {
    this.setState({ email: e.target.value });
  }
  async changeStateSelected(e) {
    this.setState({
      state: e.target.value,
    }); 
  }
  async changeCitySelected(e) {
    this.setState({
      city: e.target.value,
    });
  }
  async componentWillMount() {
    let apiHelper = new ApiHelper();
    let apiCountryResult = await apiHelper.FetchFromServer(
      "/",
      "userCart/getCountries",
      "GET",
      true,
      undefined,
      undefined
    );
    if (!(apiCountryResult.isError)) {
      this.setState({ countryData: apiCountryResult.data.data });
    }
    	let data = {
    	  countryId: this.state.country,
    	  stateId: ""
    	};
    	let cityList = await apiHelper.FetchFromServer(
    	  "/",
    	  "userCart/state",
    	  "GET",
    	  false,
    	  data,
    	  undefined
      );
       if (!(cityList.isError)) {
         this.setState({
           cityList: cityList.data.states
         }); 
       }

    let apiProfile = new ApiHelper();
    this.setState({isLoading: true});
    let apiResult = await apiProfile.FetchFromServer(
      "/",
      "user/profile",
      "GET",
      true,
      undefined
    );
    console.log(apiResult);
    if(apiResult.isError) {
      this.setState({isLoading: false});    
      localStorage.removeItem("localStorageVal");
      const { history } = this.props;
      history.push("/login");
    }
    else {
      updateToken({token:apiResult.data.token})
      this.setState({isLoading: false});    
      this.setState({
        firstName: apiResult.data.data.firstName,
        lastName: apiResult.data.data.lastName,
        contactNumber: apiResult.data.data.contactNumber,
        email: apiResult.data.data.email,
        country: this.state.country,
        state: apiResult.data.data.state,
        city: apiResult.data.data.city,
        postalCode: apiResult.data.data.postalCode,
        address: apiResult.data.data.address,
        address2: apiResult.data.data.address2,
      });    
    }
  }
  updatePostalCode(e) {
    this.setState({ postalCode: e.target.value });
  }
  updateAddress(e) {
    this.setState({ address: e.target.value });
  }
  updateAddress2(e) {
    this.setState({ address2: e.target.value });
  }
  async handleSubmit(event) {
    event.preventDefault();
    let stateValue = document.getElementById("billing_state").value;
    this.setState({
      state: stateValue
    });
   
    var postal = this.state.postalCode;
  
    if (this.state.firstName === "") {
      this.setState({
        errorClassFirstName: "show_block",
        errorMsgFirstName: "First Name Is Required"
      });
      return;
    } else if (this.state.firstName.match(/\s/g)) {
      this.setState({
        errorClassFirstName: "show_block",
        errorMsgFirstName: "First Name Is Not Contain Whitespace"
      });
      return;
    } else {
      this.setState({
        errorClassFirstName: "display_none",
        errorMsgFirstName: ""
      });
    }

    if (this.state.lastName === "") {
      this.setState({
        errorClassLastName: "show_block",
        errorMsgLastName: "Last Name Is Required"
      });
      return;
    } else if (this.state.lastName.match(/\s/g)) {
      this.setState({
        errorClassLastName: "show_block",
        errorMsgLastName: "Last Name Is Not Contain Whitespace"
      });
      return;
    } else {
      this.setState({
        errorClassLastName: "display_none",
        errorMsgLastName: ""
      });
    }

    if (this.state.country === "") {
      this.setState({
        errorClassCountry: "show_block",
        errorMsgCountry: "Country Is Required"
      });
      return;
    } else {
      this.setState({
        errorClassCountry: "display_none",
        errorMsgCountry: ""
      });
    }

    if (stateValue === "") {
      this.setState({
        errorClassState: "show_block",
        errorMsgState: "State Is Required"
      });
      return;
    } else {
      this.setState({
        errorClassState: "display_none",
        errorMsgState: ""
      });
    }
    if (this.state.city === "") {
      this.setState({
        errorClassCity: "show_block",
        errorMsgCity: "City Is Required"
      });
      return;
    } else {
      this.setState({
        errorClassCity: "display_none",
        errorMsgCity: ""
      });
    }

    if (this.state.postalCode === "") {
      this.setState({
        errorClassPostalCode: "show_block",
        errorMsgPostalCode: "Postal Code Is Required"
      });
      return;
    } else if (isNaN(this.state.postalCode)) {
      this.setState({
        errorClassPostalCode: "",
        errorMsgPostalCode: "Postal Code Should Be Numeric"
      });
      return;
    } else if (String(postal).match(/\s/g)) {
      this.setState({
        errorClassPostalCode: "",
        errorMsgPostalCode: "Postal Code Is Not Contain Whitespace"
      });
      return;
    } else {
      this.setState({
        errorClassPostalCode: "display_none",
        errorMsgPostalCode: ""
      });
    }
    if (!this.state.address) {
      this.setState({
        errorClassAddress: "",
        errorMsgAddress: "Address Is Required"
      });
      return;
    }
    // if (!this.state.address2) {
    //   this.setState({
    //     errorClassAddress2: "",
    //     errorMsgAddress2: "Suite/Apt Is Required"
    //   });
    //   return;
    // }
    // else {
    //   this.setState({
    //     errorClassAddress2: 'display_none',
    //     errorMsgAddress2: ''
    //   })
    // }
    var addressRegex = this.state.address.match(/^\S[0-9a-zA-Z.\s,'-,]*$/);
    if (!addressRegex){
      this.setState({
        errorClassAddress: "show_block",
        errorMsgAddress: "Address can"
      });
      return;
    }
    else {
      this.setState({
        errorClassAddress: "display_none",
        errorMsgAddress: ""
      });
    }
    let api = new ApiHelper();
    let data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      contactNumber: this.state.contactNumber,
      email: this.state.email,
      country: this.state.country,
      state: stateValue,
      city: this.state.city,
      postalCode: this.state.postalCode,
      address: this.state.address,
      address2: this.state.address2,
    };
    const storageSession = JSON.parse(localStorage.getItem("localStorageVal"));
    if (storageSession) {
      this.setState({isLoading: true});
      let result = await api.FetchFromServer(
        "/",
        "user/updateProfile",
        "PUT",
        true,
        undefined,
        data
      );
      this.setState({isDataUpdating : true});
      setTimeout(() => {
        this.setState({isDataUpdating : false});
      }, 3000);
      if (result.isError) {
        this.setState({isLoading: false});
        ToastStore.error(result.messages[1]);
        return;
      } else {
        this.setState({ isLoading: false });
        ToastStore.success(result.data.message);
      }
    } else {
      const { history } = this.props;
      history.push("/login");
    }
  }
  render() {
    return (
      <section className="dashboard-page">
        <nav className="breadcrumb">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>Address</li>
          </ul>
        </nav>
        <div className="row dashboard">
          <div className="clearfix dashboard-width-wrap">
          <LeftSidebarMobileView />	
            <div className="col-md-2 col-sm-3 dashboard-left-warp">
              <div className="dashboard-left">
                <h1>My Account </h1>
                <LeftSidebar />
              </div>
            </div>
            <div className="col-md-10 col-sm-9 dashboard-right-warp">
              <div className="dashboard-right section-white">
                <div className="heading">
                  <img
                    alt=""
                    src={
                      Constant.frontUrl + "/assets/img/icons/address_black.svg"
                    }
                    width="25px"
                  />
                  My Address
                </div>
                <div className="clearfix" />
                <div className="col-sm-12 center-block">
                {
                  this.state.isLoading ? 
                  <Loader/> : null
                }
                  <form id="profileform" method="POST">
                    <div className="form-group col-sm-6">
                      <label for="name">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={this.state.firstName}
                        onChange={this.updateFirstName.bind(this)}
                        className="form-control"
                        placeholder="Jane"
                      />
                      <div
                        className={
                          this.state.errorClassFirstName + " error-msg"
                        }
                      >
                        {this.state.errorMsgFirstName}
                      </div>
                    </div>
                    <div className="form-group col-sm-6">
                      <label for="name">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={this.state.lastName}
                        onChange={this.updateLastName.bind(this)}
                        className="form-control"
                        placeholder="Doe"
                      />
                      <div
                        className={this.state.errorClassLastName + " error-msg"}
                      >
                        {this.state.errorMsgLastName}
                      </div>
                    </div>                   
                   
                    <div className="clearfix" />
                    <div className="form-group col-sm-6">
                      <label for="number">Country</label>                    
                        <select
                          className="form-control"
                          name="country"
                          id="billing_country"
                          value={this.state.country}
                        > 
                        { 
                          this.state.countryData ?
                            this.state.countryData.map((item, index) => {
                              if(item.id === 231)
                                return <option value={item.id} key={index}>
                                        {item.name}
                                      </option>
                                return false;
                            })
                          : null
                        }
                        </select>     
                      <div
                        className={this.state.errorClassCountry + " error-msg"}
                      >
                        {this.state.errorMsgCountry}
                      </div>
                    </div>
                    <div className="form-group col-sm-6">
                      <label className="">Address</label>
                      <input
                        name="address"
                        id="address"
                        value={this.state.address}
                        placeholder="xyz street"
                        className="form-control"
                        onChange={this.updateAddress.bind(this)}
                      />
                      <div
                        className={this.state.errorClassAddress + " error-msg"}
                      >
                        {this.state.errorMsgAddress}
                      </div>
                    </div>
                
                    <div className="form-group col-sm-6">
                      <label className="">Suite/Apt</label>
                      <input
                        name="address2"
                        id="address2"
                        value={this.state.address2}
                        placeholder="xyz street"
                        className="form-control"
                        onChange={this.updateAddress2.bind(this)}
                      />
                      {/* <div
                        className={this.state.errorClassAddress2 + " error-msg"}
                      >
                        {this.state.errorMsgAddress2}
                      </div> */}
                    </div>
                    <div className="form-group col-sm-6">
                      <label for="number">City</label>
                      <input
                        type="text"
                        id = "billing_city"
                        name="city"
                        value={this.state.city}
                        onChange={this.changeCitySelected.bind(this)}
                        className="form-control"
                        placeholder="City"
                      />
                      <div className={this.state.errorClassCity + " error-msg"}>
                        {this.state.errorMsgCity}
                      </div>
                    </div>
                         <div className="clearfix" />
                    <div className="form-group col-sm-6">
                      <label for="number">State</label>
                      <select
                          className="form-control"
                          name="country"
                          id = "billing_state"
                          onChange={this.changeStateSelected.bind(this)}
                          value ={this.state.state}
                        > 

                        { 
                          this.state.cityList ?
                            this.state.cityList.map((item, index) => {
                              return( 
                                <option value={item.id} key={index}>
                                  {item.name}
                                </option>
                              );
                            })
                          : null
                        }
                        </select>
                      {/* <input
                        type="text"
                        id="state"
                        name="state"
                        value={this.state.state}
                        onChange={this.changeStateSelected.bind(this)}
                        className="form-control"
                        placeholder="State"
                      /> */}
                      <div
                        className={this.state.errorClassState + " error-msg"}
                      >
                        {this.state.errorMsgState}
                      </div>
                    </div>
                    {/* <div className="clearfix" /> */}
                    <div className="form-group col-sm-6">
                      <label for="postalcode">Postal Code</label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={this.state.postalCode}
                        onChange={this.updatePostalCode.bind(this)}
                        className="form-control"
                        placeholder="452101"
                      />
                      <div
                        className={
                          this.state.errorClassPostalCode + " error-msg"
                        }
                      >
                        {this.state.errorMsgPostalCode}
                      </div>
                    </div>
                    <div className="clearfix" />
                    
                    <div className="clearfix" />
                    <br />
                    <div className="form-group text-center">
                    {
                      this.state.isDataUpdating ?
                      
                      <button
                        disabled
                        className="btn-effect one"
                      >
                        Submit
                      </button> :
                      <button
                        type="submit"
                        onClick={this.handleSubmit.bind(this)}
                        className="btn-effect one"
                      >
                        Submit
                      </button>
                    }
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Address;
