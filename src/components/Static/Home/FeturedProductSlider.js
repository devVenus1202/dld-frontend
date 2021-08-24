import React, { Component } from 'react';
import Slider from "react-slick";

import { Link } from 'react-router-dom';
class FeturedProductSlider extends Component {
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
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
    };
    return (      
		<section className="homeSlider">
            <div className="slick-custom-btn">
                <button className="btn-effect one" onClick={this.previous}>
                    <i className="fa fa-angle-left" aria-hidden="true"></i>
                </button>
                <button className="btn-effect one" onClick={this.next}>
                <i className="fa fa-angle-right" aria-hidden="true"></i>
                </button>
            </div>
		    <Slider {...settings} ref={c => (this.slider = c)}>
            <div className="product-item">
                <Link to ="/product/ak-47" className="product-inner clearfix">
                    <div className="image-block">
                     <div className="list-image">
                        
                        <img alt="" src="https://cdn.shopify.com/s/files/1/2041/4955/products/temp2_380x.PNG?v=1540596165"/>
                        </div>
                    </div>
                    <div className="product-info">
                        <h4 className="product-name product_title">
                        Benchmade Auto Stryker
                        </h4>
                    </div>
                    <div className="product-group-info">
                        <div className="price">
                        <span className="Price-amount">
                            <span>
                             <span className="currencySymbol">$</span>55.00
                            </span>
                        </span>
                        </div>
                        <div className="remaing-items">
                        <span><font>40</font> Quantity Remaining</span>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="product-item">
                <Link to ="/product/ak-47" className="product-inner clearfix">
                    <div className="image-block">
                     <div className="list-image">
                        
                        <img alt="" src="https://cdn.shopify.com/s/files/1/2041/4955/products/AAA-9fF4iSO68gkeOXE9CMdJ9PwXhlQs5bMqqooMUyGossdkYobNrDTFopZJRIazfdd96SQee7Vpum0wKciHMMW98hqMrQm66XtfGzxQZzZPaGP7iP2-5rBgYIAgssl2-pdoCvQn0flOXVTCSUWh86Zsn56eBlwOXFy_kVZDTtGzDs1ugA9ulm2xRLxb3TSG_6yCkJUM_820x.jpg?v=1524145362"/>
                        </div>
                        
                    </div>
                    <div className="product-info">
                        <h4 className="product-name product_title">
                        Benchmade Auto Stryker
                        </h4>
                    </div>
                    <div className="product-group-info">
                        <div className="price">
                        <span className="Price-amount">
                           <span>
                               <span className="currencySymbol">$</span>55.00
                           </span>
                        </span>
                        </div>
                        <div className="remaing-items">
                        <span><font>40</font> Quantity Remaining</span>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="product-item">
                <Link to ="/product/ak-47" className="product-inner clearfix">
                    <div className="image-block">
                     <div className="list-image">
                        
                        <img alt="" src="https://cdn.shopify.com/s/files/1/2041/4955/products/image_6b11ccd3-9141-4ddb-a566-20726ddb94bd_380x.jpg?v=1523217803"/>
                        </div>
                    </div>
                    <div className="product-info">
                        <h4 className="product-name product_title">
                        Benchmade Auto Stryker
                        </h4>
                    </div>
                    <div className="product-group-info">
                        <div className="price">
                        <span className="Price-amount"><span>
                            <span className="currencySymbol">$</span>55.00</span>
                        </span>
                        </div>
                        <div className="remaing-items">
                        <span><font>40</font> Quantity Remaining</span>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="product-item">
                <Link to ="/product/ak-47" className="product-inner clearfix">
                    <div className="image-block">
                     <div className="list-image">
                        <img alt="" src="https://cdn.shopify.com/s/files/1/2041/4955/products/IMG_1830-1_380x.PNG?v=1534216226"/>
                    </div>
                    </div>
                    <div className="product-info">
                        <h4 className="product-name product_title">
                        Benchmade Auto Stryker
                        </h4>
                    </div>
                    <div className="product-group-info">
                        <div className="price">
                        <span className="Price-amount"><span>
                            <span className="currencySymbol">$</span>55.00</span>
                        </span>
                        </div>
                        <div className="remaing-items">
                        <span><font>40</font> Quantity Remaining</span>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="product-item">
                <Link to ="/product/ak-47" className="product-inner clearfix">
                    <div className="image-block">
                     <div className="list-image">
                        
                        <img alt="" src="https://cdn.shopify.com/s/files/1/2041/4955/products/AADkHvC-S8Px1fsLHXI2JGZaRBo-xJoi7GwlZ8n4T1eGSH1grgKrUr2Gpxf3bBd9sSEPnHcDBKwPVDpv7K7q2VMMiRLsKCqTTVyiMKzv61CP7Qsn2CHKWV_K4-z4itdvqK7Wan_WErMocP8P7WWdzfN60rCpqG5272GTTY1z807ymA4Ho7y5nedSrM1PfgubMN8h6WU8_820x.jpg?v=1517909264"/>
                        </div>
                    </div>
                    <div className="product-info">
                        <h4 className="product-name product_title">
                        Benchmade Auto Stryker
                        </h4>
                    </div>
                    <div className="product-group-info">
                        <div className="price">
                        <span className="Price-amount"><span>
                            <span className="currencySymbol">$</span>55.00</span>
                        </span>
                        </div>
                        <div className="remaing-items">
                        <span><font>40</font> Quantity Remaining</span>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="product-item">
                <Link to ="/product/ak-47" className="product-inner clearfix">
                    <div className="image-block">
                     <div className="list-image">
                        
                        <img alt="" src="https://cdn.shopify.com/s/files/1/2041/4955/products/AACCc2eMYi3MJ1OiR0Q8qfhtxFnkLhuLHKU0_37P8vFACOxe0_LduthuAaD2UlKV624GT-qLhh_alRc44nh-rx7Nu-HxAWzN29y5msIvUsmgM2oOir1m06f0FsZIsQc7veHA_GAiET_aaiLSs6oMNInMMevpdyD3lD9gcXJqFOyCjb5jqHYr-EvNFPflnOj5FJuirX8g_820x.jpg?v=1517886130"/>
                        </div>
                    </div>
                    <div className="product-info">
                        <h4 className="product-name product_title">
                        Benchmade Auto Stryker
                        </h4>
                    </div>
                    <div className="product-group-info">
                        <div className="price">
                        <span className="Price-amount">
                            <span><span className="currencySymbol">$</span>55.00</span>
                        </span>
                        </div>
                        <div className="remaing-items">
                        <span><font>40</font> Quantity Remaining</span>
                        </div>
                    </div>
                </Link>
            </div><div className="product-item">
                <Link to ="/product/ak-47" className="product-inner clearfix">
                    <div className="image-block">
                     <div className="list-image">
                        
                        <img alt="" src="https://cdn.shopify.com/s/files/1/2041/4955/products/image_11893cb1-c51d-4ae2-bb27-465fd47bfbe0_400x.jpg?v=1538147145"/>
                        </div>
                    </div>
                    <div className="product-info">
                        <h4 className="product-name product_title">
                        Benchmade Auto Stryker
                        </h4>
                    </div>
                    <div className="product-group-info">
                        <div className="price">
                        <span className="Price-amount">
                            <span><span className="currencySymbol">$</span>55.00</span>
                        </span>
                        </div>
                        <div className="remaing-items">
                        <span><font>40</font> Quantity Remaining</span>
                        </div>
                    </div>
                </Link>
            </div><div className="product-item">
                <Link to ="/product/ak-47" className="product-inner clearfix">
                    <div className="image-block">
                     <div className="list-image">
                        
                        <img alt="" src="https://cdn.shopify.com/s/files/1/2041/4955/products/BPI105911_1_820x.jpg?v=1536076436"/>
                        </div>
                    </div>
                    <div className="product-info">
                        <h4 className="product-name product_title">
                        Benchmade Auto Stryker
                        </h4>
                    </div>
                    <div className="product-group-info">
                        <div className="price">
                        <span className="Price-amount">
                            <span><span className="currencySymbol">$</span>55.00</span>
                        </span>
                        </div>
                        <div className="remaing-items">
                        <span><font>40</font> Quantity Remaining</span>
                        </div>
                    </div>
                </Link>
            </div><div className="product-item">
                <Link to ="/product/ak-47" className="product-inner clearfix">
                    <div className="image-block">
                     <div className="list-image">
                        
                        <img alt="" src="https://cdn.shopify.com/s/files/1/2041/4955/products/AABW6ejgmLiew1Icvgj8MWiLTMk6OJasLsdYSs5eqzc_1yaErkH4ysKmx6MpqmeVyAFwDGySXDL_PenGHRepe4ClPurMq-y7I1LtaM9Rmhmu3wzJmckKTajbcE1xArIKambMtYi1F3aMNkQrEyxRUOw4PEb3-00HEYJ9Giy9LRkhYFc052JvKvT9sAFCe3aM-v93jMzs_820x.jpg?v=1517900210"/>
                        </div>
                    </div>
                    <div className="product-info">
                        <h4 className="product-name product_title">
                        Benchmade Auto Stryker
                        </h4>
                    </div>
                    <div className="product-group-info">
                        <div className="price">
                        <span className="Price-amount">
                            <span><span className="currencySymbol">$</span>55.00</span>
                        </span>
                        </div>
                        <div className="remaing-items">
                        <span><font>40</font> Quantity Remaining</span>
                        </div>
                    </div>
                </Link>
            </div><div className="product-item">
                <Link to ="/product/ak-47" className="product-inner clearfix">
                    <div className="image-block">
                     <div className="list-image">
                        
                        <img alt="" src="https://cdn.shopify.com/s/files/1/2041/4955/products/AADysFSyIlk9tEq29Ofwyx9RIkcTHqtRMDr09Jm4qKBw1Qyh_XhwTQc-Gs1BjxZq_Uzp4foVuNc1u2Kf9IDLKjrwIp0TtpLFbwWZx5NXGYPhMEUTIUD0VnC8DcO5OK9rcqCOkyaKjPGJ5s0ngFnvXm_AjXfaEiUxW3Znp3Q7fYnR3IHMPcVcZqghU8BOTZUyP5oyLUZy_820x.jpg?v=1517905269"/>
                        </div>
                    </div>
                    <div className="product-info">
                        <h4 className="product-name product_title">
                        Benchmade Auto Stryker
                        </h4>
                    </div>
                    <div className="product-group-info">
                        <div className="price">
                        <span className="Price-amount">
                            <span><span className="currencySymbol">$</span>55.00</span>
                        </span>
                        </div>
                        <div className="remaing-items">
                        <span><font>40</font> Quantity Remaining</span>
                        </div>
                    </div>
                </Link>
            </div><div className="product-item">
                <Link to ="/product/ak-47" className="product-inner clearfix">
                    <div className="image-block">
                     <div className="list-image">
                        
                        <img alt="" src="https://cdn.shopify.com/s/files/1/2041/4955/products/temp_7_de8c7a69-163c-4788-acd9-080fb0e9d38e_380x.PNG?v=1540091363"/>
                        </div> 
                    </div>
                    <div className="product-info">
                        <h4 className="product-name product_title">
                        Benchmade Auto Stryker
                        </h4>
                    </div>
                    <div className="product-group-info">
                        <div className="price">
                        <span className="Price-amount">
                            <span> <span className="currencySymbol">$</span>55.00</span>
                        </span>
                        </div>
                        <div className="remaing-items">
                        <span><font>40</font> Quantity Remaining</span>
                        </div>
                    </div>
                </Link>
            </div><div className="product-item">
                <Link to ="/product/ak-47" className="product-inner clearfix">
                    <div className="image-block">
                     <div className="list-image">
                        
                        <img alt="" src="https://cdn.shopify.com/s/files/1/2041/4955/products/image_bba3ae77-c523-4240-9a8a-c05304be8de5_400x.jpg?v=1539271526"/>
                        </div>
                    </div>
                    <div className="product-info">
                        <h4 className="product-name product_title">
                        Benchmade Auto Stryker
                        </h4>
                    </div>
                    <div className="product-group-info">
                        <div className="price">
                        <span className="Price-amount">
                            <span> <span className="currencySymbol">$</span>55.00</span>
                        </span>
                        </div>
                        <div className="remaing-items">
                        <span><font>40</font> Quantity Remaining</span>
                        </div>
                    </div>
                </Link>
            </div>
        </Slider>
		
	</section>  
    );
  }
}
export default FeturedProductSlider;