import React, { Component } from "react";
import Constant from "../../../config/Constant";
import LeftSidebar, { LeftSidebarMobileView } from "./LeftSidebar";
import { ApiHelper } from "../../../helpers/ApiHelper";
import { ToastStore } from "react-toasts";
import { Loader } from "../../Static/Common/Loader/Loader";
import { updateToken } from "../../../helpers/user";
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      // address: "",
      firstNameErrorMessage: "",
      lastNameErrorMessage: "",
      contactNumberErrorMessage: "",
      emailErrorMessage: "",
      addressErrorMessage: "",
      errorClassfirstName: "display_none",
      errorClasslastName: "display_none",
      errorClasscontactNumber: "display_none",
      errorClassemail: "display_none",
      isProfileUpdating: false
      // errorClassaddress: "display_none"
    };
    this.handelChange = this.handelChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const storageSession = JSON.parse(localStorage.getItem("localStorageVal"));
    if (storageSession) {
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
        "/",
        "user/profile",
        "GET",
        true,
        undefined
      );
      console.log(result);
      if (result.isError) {
         const {
           history
         } = this.props;
        localStorage.removeItem("localStorageVal");
         history.push("/login");
      } else {
        updateToken({token: result.data.token});
        this.setState({
          firstName: result.data.data.firstName,
          lastName: result.data.data.lastName,
          contactNumber: result.data.data.contactNumber,
          email: result.data.data.email,
        });
      }
    }
    else {
      const { history } = this.props;
      history.push("/login");
    }
  }
  handelChange(event) {
    if (event.target.name === "contactNumber") {
      if (isNaN(event.target.value)) {
        return;
      }
    }
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    var data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      contactNumber: this.state.contactNumber,
      };
      this.setState({isProfileUpdating : true});
      setTimeout(() => {
        this.setState({isProfileUpdating : false});
      }, 3000);
    const { firstName, lastName, contactNumber } = this.state;
    var nameRegex = this.state.firstName.match(/^[0-9a-zA-Z][0-9a-zA-Z\s]*$/);
    if (firstName === "") {
      this.setState({
        firstNameErrorMessage: "First Name is Required",
        errorClassfirstName: "show_block"
      });
      return;
    } else if (!nameRegex) {
      this.setState({
        firstNameErrorMessage: " First Name Can Not Empty.",
        errorClassfirstName: ""
      });
      return;
    } else {
      this.setState({
        errorClassfirstName: "display_none",
        firstNameErrorMessage: ""
      });
    }
    var lastNameRegex = lastName.match(/^[0-9a-zA-Z][0-9a-zA-Z\s]*$/);
    if (lastName === "") {
      this.setState({
        lastNameErrorMessage: "Last Name is Required",
        errorClasslastName: "show_block"
      });
      return;
    } else if (!lastNameRegex) {
      this.setState({
        lastNameErrorMessage: "Last Name Can Not Empty.",
        errorClasslastName: "show_block"
      });
      return;
    } else {
      this.setState({
        errorClasslastName: "display_none",
        lastNameErrorMessage: ""
      });
    }
    if (isNaN(contactNumber)) {
      this.setState({
        contactNumberErrorMessage: "Contact Number is Invalid",
        errorClasscontactNumber: "show_block"
      });
      return;
    }
    var contactRegex = this.state.contactNumber.match(/^\d{7,14}$/);
    if (contactNumber === "") {
      this.setState({
        contactNumberErrorMessage: "Contact Number is Required",
        errorClasscontactNumber: "show_block"
      });
      return;
    } 
    else if (!contactRegex) {
      this.setState({
        contactNumberErrorMessage: "Contact Number is invalid",
        errorClasscontactNumber: "show_block"
      });
      return;
    } else {
      this.setState({
        errorClasscontactNumber: "display_none",
        contactNumberErrorMessage: ""
      });
    }
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "user/updateProfile",
      "PUt",
      true,
      undefined,
      data
    );
    if (result.isError) {
      ToastStore.error(result.messages[0]);
      return;
    } else {
      ToastStore.success(result.data.message);
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
            <li>Profile</li>
          </ul>
        </nav>
        <div className="row dashboard">
          <div className="clearfix dashboard-width-wrap">
            <LeftSidebarMobileView />		           
            <div className="col-md-2 col-sm-3 dashboard-left-warp">
              <div className="dashboard-left">
                <h1>My Account </h1>
                <LeftSidebar/>
              </div>
            </div>
            <div className="col-md-10 col-sm-9 dashboard-right-warp">
              <div className="dashboard-right section-white">
                <div className="heading">
                  <img
                    alt=""
                    src={Constant.frontUrl + "/assets/img/icons/user_black.svg"}
                    width="25px"
                  />
                  My Profile
                </div>
                <div className="clearfix" />
                <div className="col-sm-12 center-block">
                {
                  this.state.isProfileUpdating ? 
                  <Loader /> : null
                }
                  <form id="profileform">
                    <div className="form-group col-sm-6">
                      <label for="name">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id=""
                        name="firstName"
                        value={this.state.firstName}
                        placeholder="Jane"
                        onChange={this.handelChange}
                      />
                      <div
                        className={
                          this.state.errorClassfirstName + " error-msg"
                        }
                      >
                        {" "}
                        {this.state.firstNameErrorMessage}
                      </div>
                    </div>

                    <div className="form-group col-sm-6">
                      <label for="name">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id=""
                        name="lastName"
                        value={this.state.lastName}
                        onChange={this.handelChange}
                        placeholder="Doe"
                      />
                      <div
                        className={this.state.errorClasslastName + " error-msg"}
                      >
                        {this.state.lastNameErrorMessage}
                      </div>
                    </div>
                    <div className="clearfix" />
                    <div className="form-group col-sm-6">
                      <label for="number">Mobile number</label>
                      <input
                        type="text"
                        className="form-control"
                        id="mobile"
                        value={this.state.contactNumber}
                        name="contactNumber"
                        onChange={this.handelChange}
                        placeholder="xxxxxxxxxx"
                        maxLength={14}
                      />
                      <div
                        className={
                          this.state.errorClasscontactNumber + " error-msg"
                        }
                      >
                        {this.state.contactNumberErrorMessage}
                      </div>
                    </div>

                    <div className="form-group col-sm-6">
                      <label for="email">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handelChange}
                        placeholder="john@example.com"
                        disabled
                      />
                      <div
                        className={this.state.errorClassemail + " error-msg"}
                      >
                        {this.state.emailErrorMessage}
                      </div>
                    </div>
                    <div className="clearfix" />
                    <br />
                    <div className="form-group text-center">
                    {
                      this.state.isProfileUpdating ? 
                      <button
                        className="btn-effect one"
                        disabled
                      >
                        Update
                      </button>:
                      
                      <button
                        type="submit"
                        className="btn-effect one"
                        onClick={this.handleSubmit}
                      >
                        Update
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

export default Profile;
