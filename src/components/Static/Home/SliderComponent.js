import React, { Component } from 'react';
import Constant from '../../../config/Constant';
import Slider from "react-slick";

class SliderComponent extends Component {
	next = () => {
		this.slider.slickNext();
	}
	previous = () => {
		this.slider.slickPrev();
	}
  render() {
		const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (      
		<section className="homeSlider">
				<div className="slick-banner-btn">
					<button className="prives-btn" onClick={this.previous}>
							<i className="fa fa-angle-left" aria-hidden="true"></i>
					</button>
					<button className="next-btn" onClick={this.next}>
					<i className="fa fa-angle-right" aria-hidden="true"></i>
					</button>
				</div>
		    <Slider {...settings} ref={c => (this.slider = c)}>
				<div >
					<img src={Constant.frontUrl+"/assets/slider/banner-1.jpg"} alt="one"/>
				</div>
				<div >
					<img src={Constant.frontUrl+"/assets/slider/banner-2.jpg"} alt="two"/>
				</div>
				<div >
					<img src={Constant.frontUrl+"/assets/slider/banner-3.jpg"} alt="third"/>
				</div>
        </Slider>
		
		</section>  
    );
  }
}

export default SliderComponent;
