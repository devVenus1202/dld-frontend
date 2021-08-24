import React, { Component } from 'react';
import Constant from '../../../config/Constant';
import LeftSidebar, { LeftSidebarMobileView	} from "./LeftSidebar";
import { ApiHelper } from '../../../helpers/ApiHelper';
import {ToastStore} from 'react-toasts';
class ChangePassword extends Component {
    constructor(props){
        super(props);
        this.state={
            oldPassword:"",
            newPassword:"",
            confirmPassword:"",
            errorClassoldPassword:'display_none',
            oldPasswordErrorMessage:"",
            errorClassnewPassword:'display_none',
            newPasswordErrorMessage:"",
            errorClassconfirmPassword:'display_none',
            confirmPasswordErrorMessage:"",     
        }
        this.handleChange=this.handleChange.bind(this);
        this.handlesubmit=this.handlesubmit.bind(this);
    }
    handleChange(event){
        this.setState({[event.target.name]:event.target.value});
    }
    async handlesubmit(event){
        event.preventDefault();
        var data={
            oldPassword:this.state.oldPassword,
            password:this.state.confirmPassword
        }
        const {oldPassword,newPassword,confirmPassword}=this.state;
        if(oldPassword === ""){
            this.setState({
                oldPasswordErrorMessage:"Old password is required",
                errorClassoldPassword:'show_block'
            });
            return
        }
        else if(oldPassword.match(/\s/g)){
            this.setState({
                oldPasswordErrorMessage:"Old password cannot contain whitespace",
                errorClassoldPassword:'show_block'
            });
            return  
        }
        else{
            this.setState({errorClassoldPassword:'display_none',oldPasswordErrorMessage:''});
        }
        if(newPassword === ""){
            this.setState({
                newPasswordErrorMessage:"New password is required",
                errorClassnewPassword:'show_block'
            });
            return  
        }
        else if(newPassword.match(/\s/g)){
            this.setState({
                newPasswordErrorMessage:"New password cannot contain whitespace",
                errorClassnewPassword:'show_block'
            });
            return  
        }
        else if(newPassword.length<6){
        this.setState({
            newPasswordErrorMessage:"Please Enter at Least 6 character",
            errorClassnewPassword:'show_block'
        });
            return  
        }
        else{
            this.setState({errorClassnewPassword:'display_none',newPasswordErrorMessage:''});
        }
        if(confirmPassword === "" || confirmPassword !== newPassword){
            this.setState({
                confirmPasswordErrorMessage:"Password does not match",
                errorClassconfirmPassword:'show_block'
        });
            return 
        }
        else{
            this.setState({errorClassconfirmPassword:'display_none',confirmPasswordErrorMessage:'',display:false});
        }
        const storageSession=JSON.parse(localStorage.getItem('localStorageVal')); 
        if(storageSession)
        {
            let api = new ApiHelper();
            let result = await api.FetchFromServer('/', 
                                'user/changePassword', 
                                'PUt', 
                                true, 
                                undefined,
                                data
                                );
            if (result.isError) {
                ToastStore.error(result.messages[1]);
                return;         
            }
            else{ 
                ToastStore.success(result.data.message); 
            }
        }
        else {
            const { history } = this.props;
            history.push("/login");
        }
        this.setState({
            oldPassword:"",
            newPassword:"",
            confirmPassword:""
        })
    }
    render() {
        return (      
            <section className="dashboard-page">
                <nav className="breadcrumb">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li>Change password</li>
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
                                    <img alt="" src={Constant.frontUrl+"/assets/img/icons/lock_black.svg"} width="25px"/>
                                    Change Password
                                </div>
                                <div className="clearfix"></div>
                                <div className="col-sm-8 center-block">
                                    <form id="profileform" >
                                        <div className="form-group col-sm-12">
                                            <label for="name">Old Password </label>
                                            <input type="password" className="form-control" id="" name="oldPassword" value={this.state.oldPassword} placeholder="xxxxxxxxxx" onChange={this.handleChange}/>
                                            <div className={this.state.errorClassoldPassword+" error-msg"}>{this.state.oldPasswordErrorMessage}</div>
                                        </div>
                                        <div className="form-group col-sm-12">
                                            <label for="name">New Password</label>
                                            <input type="password" className="form-control" id=""  name="newPassword" value={this.state.newPassword} placeholder="xxxxxxxxxx" onChange={this.handleChange} pattern="^\S+$"/>
                                            <div className={this.state.errorClassnewPassword+" error-msg"}>{this.state.newPasswordErrorMessage}</div>
                                        </div>
                                        <div className="form-group col-sm-12">
                                            <label for="name">Confirm Password</label>
                                            <input type="password" className="form-control" id=""  name="confirmPassword" value={this.state.confirmPassword} placeholder="xxxxxxxxxx" onChange={this.handleChange}/>
                                            <div className={this.state.errorClassconfirmPassword+" error-msg"}>{this.state.confirmPasswordErrorMessage}</div>
                                        </div>
                                        <div className="clearfix"></div>
                                        <br/>
                                        <div className="form-group text-center">
                                            <button type="submit" className="btn-effect one" onClick={this.handlesubmit}>Update</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>          
        )
    }
}

export default ChangePassword;
