import React, { Component } from 'react';
import Constant from '../../../config/Constant';
import LeftSidebar, {LeftSidebarMobileView} from './LeftSidebar';
import { ApiHelper } from './../../../helpers/ApiHelper';
import { Modal } from "react-bootstrap";
import moment from "moment";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Dropzone from 'react-dropzone';
import { AppConfig } from "../../../config/AppConfig";
import { withRouter } from "react-router";
import { Loader } from "../../Static/Common/Loader/Loader";
import {Link} from "react-router-dom";
import CurrentWebinars from '../CurrentWebinars'
import {WEBINAR_STATE_UPCOMING, WEBINAR_STATE_ONGOING} from "../../../constants";
import { updateToken } from '../../../helpers/user';

class Dashboard extends Component {
	constructor(props){
		super(props);
		this.state = {
			firstName:"",
			isOpenModal: false,
			src: null,
			crop: {
				aspect: 4/4,
				width:20,
				x: 0,
				y: 0
			},
			cropImage: "",
			cropDisable: false,
			isImage: false,
			actualImage: '',
            webinars: [],
		}
	}
	async componentWillMount(){
		let apiProfile = new ApiHelper();
		const toState = {};

        const webinarsResponse = await apiProfile.FetchFromServer('/', 'order/webinarList', 'GET', true, {
            webinarState: `${WEBINAR_STATE_UPCOMING},${WEBINAR_STATE_ONGOING}`,
        }).then(r => r.data.data.slice(0, 4), () => []);
		toState.webinars = webinarsResponse;

		let apiResult = await apiProfile.FetchFromServer('/', 'user/profile', 'GET', true, undefined);
		if(apiResult.isError) {
			localStorage.removeItem("localStorageVal");
			const {
				history
			  } = this.props;
			  history.push("/login");
		}
		else {
			toState.firstName = apiResult.data.data.firstName;
			toState.actualImage = apiResult.data.data.userImage;
			toState.createdAt = moment(apiResult.data.data.createdAt).format('Do MMM YYYY');
		}

		this.setState(toState);
	}

	openImageModal = () => {
		this.setState({
			isOpenModal: !this.state.isOpenModal,
			src: null,
			isImage: false,
			cropDisable: false
		});
	};
	onSelectFile = (e) => {
		var reader = new FileReader();
		if(this.state.cropDisable)
	 	{
			this.setState({ cropDisable: false });
		}
		this.setState({isImage : true});
		const scope = this;
		reader.addEventListener("load", () =>
			scope.setState({
				src: reader.result
			})
		);
		reader.onloadend = function (as) {
			var image = new Image();
			image.onload = function () {
				scope.setState({
					src: reader.result,
					cropDisable: false
				})
			}
		}
	 	reader.readAsDataURL(e[0]);
	};

	onImageLoaded = (image, pixelCrop, e) => {
		this.imageRef = image;
	};

	onCropComplete = (crop, pixelCrop) => {
		this.makeClientCrop(crop, pixelCrop);
	};

	onCropChange = crop => {
		this.setState({ crop });
	};
	cropImageValue = () => {
		this.setState({
			isOpenModal: !this.state.isOpenModal,
			actualImage: this.state.cropImage,
			cropDisable: false
		});
		this.props.imageAction(this.state.cropImage);
	};
	closeImageModal = () => {
		this.setState({
			isImage: false,
			src: null,
			cropDisable: false
		});
	}

 	async makeClientCrop(crop, pixelCrop) {
   		if (this.imageRef && crop.width && crop.height) {
     		const croppedImageUrl = await this.getCroppedImg(
       		this.imageRef,
       		pixelCrop,
       		"newFile.jpeg"
     		);
     		this.setState({ croppedImageUrl });
   		}
 	}
	getCroppedImg(image, pixelCrop, fileName) {
		const canvas = document.createElement("canvas");
		canvas.width = pixelCrop.width;
		canvas.height = pixelCrop.height;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(
				image,
				pixelCrop.x,
				pixelCrop.y,
				pixelCrop.width,
				pixelCrop.height,
				0,
				0,
				pixelCrop.width,
				pixelCrop.height
			);

			canvas.toBlob(blob => {
				blob.name = fileName;
				window.URL.revokeObjectURL(this.fileUrl);
				this.fileUrl = window.URL.createObjectURL(blob);
				var reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onloadend = () => {
					const base64data = reader.result;
					this.setState({
						cropImage: base64data,
						cropDisable: true
					});
				};
			}, "image/jpeg");
	}

 	 render() {
		  const { crop, src, webinars } = this.state;
		  const { profileInfoData, userImage } = this.props;
    	return (
			<section className="dashboard-page">
				<nav className="breadcrumb">
					<ul>
						<li><a href="/">Home</a></li>
						<li>Account</li>
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
							<div className="dashboard-right section-white main-dasboard">
								<div className="user-account-overview">

                                    <div className="user-account-summary">
                                        <div className="user-head">
                                            {
                                                userImage.isLoading ?
                                                    <Loader />
                                                    : null
                                            }
                                            <div className="profileAvtar">
                                                {/*{AppConfig.mainDomain}*/}
                                                {
                                                    profileInfoData && profileInfoData.profileInfo.userImage !== "" ?
                                                        <img alt="" src={AppConfig.cdn + 'user-image/' + profileInfoData.profileInfo.id + '.png?timeStamp='+profileInfoData.profileInfo.updatedAt } width="100px"/> :
                                                        <img alt="" src={Constant.frontUrl+"/assets/img/dashboard_avtar.svg"} width="100px"/>
                                                }
                                                <span onClick = { this.openImageModal } className="changeProfile">Change Profile </span>
                                            </div>
                                        </div>
										<div className="user-name-flex">
											<div className="user-name">{this.state.firstName}</div>
											<div className="user-social-connect">
												<a href="/" className="facebook"><i className="iconfont-facebook-18"></i></a>
											</div>
											<div className="secur-level">Member Since: {this.state.createdAt}</div>
										</div>
                                    </div>
									<div className="reward-point-show-wrap">
										<img alt="" src={Constant.frontUrl + "/assets/img/rewards.svg"} width="42px" />
										<div className="reward-text">
											<h4><span>{profileInfoData && profileInfoData.profileInfo.rewardPoint ? profileInfoData.profileInfo.rewardPoint : 0}</span>Reward Points</h4>
											<p>Use Reward Points on purchase</p>
										</div>
									</div>

								</div>
								{/*  Current webinars block  */}
								<CurrentWebinars webinars={webinars}/>

								{/*  Quick Dashboard Links  */}
								<div className="row user-account-entries">
									<div className="col-sm-6 user-account-block no-padding-right">
										<Link to="/my-webinars">
											<div className="user-account-entry order-entry">
												<h3>My Webinars</h3>
												{/* <div className="fast-links">
													<span>Awaiting Payment (0)</span>
												<br/>
													<span>Shipping (0)</span>
												</div> */}
												<span className="icon">
													<img alt=""src={Constant.frontUrl+"/assets/img/icons/ico-webinars-big.svg"} width="100px"/>
												</span>
											</div>
										</Link>
									</div>

									<div className="col-sm-6 user-account-block">
										<Link to="/orders#productid">
											<div className="user-account-entry review-entry">
												<h3>My Orders</h3>
												{/* <div className="fast-links">
													<span>Pending reviews (1)</span>
												</div> */}
												<span className="icon">
													<img alt="" src={Constant.frontUrl+"/assets/img/icons/ico-order-big.svg"} width="100px"/>
												</span>
											</div>
										</Link>
									</div>
									<div className="col-sm-6 user-account-block no-padding-right">
										<Link to="/address">
											<div className="user-account-entry address-entry">
												<h3>Shipping Address</h3>
												{/* <div className="fast-links">
													<span>Addresses currently in use (1)</span>
												</div> */}
												<span className="icon">
													<img alt="" src={Constant.frontUrl+"/assets/img/icons/ico-address-big.svg"} width="100px"/>
												</span>
											</div>
										</Link>
									</div>
									<div className="col-sm-6 user-account-block">
										<Link to="/change-password">
											<div className="user-account-entry coupon-entry">
												<h3>Change Password</h3>
												{/* <p>Reward Point will show here</p> */}
												{/* <div className="fast-links">
													<span>Available reward (0)</span>
												</div> */}
												<span className="icon">
													<img alt="" src={Constant.frontUrl+"/assets/img/icons/ico-password-big.svg"} width="100px"/>
												</span>
											</div>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Modal
					bsSize="lg"
					aria-labelledby="contained-modal-title-lg"
					show={this.state.isOpenModal}
					onHide={this.openImageModal}
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-lg">
							<div className="screenEye">
								<span>Select profile photo</span>
							</div>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="crop-image">
							{
								!this.state.isImage
								?
								<Dropzone onDrop={this.onSelectFile}>
								{({getRootProps, getInputProps, isDragActive}) => {
								return (
									<div
									{...getRootProps()}

									>
									<input {...getInputProps()} accept="image/png, image/jpeg"/>
										<div className="dropImg-wrap">
											< img src = {
												Constant.frontUrl + "/assets/img/uploadimg-thumbnail.svg"
											}
											alt = ""
											width = "80px"
											/>
											<p>Drag a profile photo here</p>
											<span className="or">- or -</span>
											<div>
												<span className="photoSelect-btn">Select a photo from your computer</span>
											</div>
										</div>
									</div>
								)
								}}
								</Dropzone>:
								null
								}
							{src && (
							<ReactCrop
								src={src}
								crop={crop}
								onImageLoaded={this.onImageLoaded}
								onComplete={this.onCropComplete}
								onChange={this.onCropChange}
								maxWidth={"65"}
								maxHeight={"65"}
								minWidth={"20"}
								minHeight={"20"}
								keepSelection={true}
							/>
							)}
						</div>
						{
							this.state.src !== null ?

								<div className="cropImg-footer">
									{
									this.state.cropDisable ?
										<button
										className="btn-orange one"
										onClick={this.cropImageValue}
										>
											Set as profile photo
										</button>
										: null
									}
									{
										this.state.isImage ?
											<button className="btn btn-default" onClick={this.closeImageModal}>Reset</button>
											: null
									}
								</div>: null
						}
					</Modal.Body>
				</Modal>
			</section>
    	)
	}
}

export default withRouter(Dashboard);
