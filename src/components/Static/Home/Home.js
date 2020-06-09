import React, { Component } from "react";
import SliderComponent from "./SliderComponent";
import FeturedProductSlider from "./FeturedProductSlider";
class Home extends Component {
  componentDidMount() {}
  render() {
    return (
      <div className="bodySection">
        <section className="home-page-slider margin-bottom50">
          <SliderComponent />
        </section>
        <div className="theme-container">
          <div className="row margin-bottom50">
            <div className="col-sm-12">
              <div className="home-product-silder">
                <div className="heading">
                  <h2>Featured Products</h2>
                </div>
                <div className="product-slider row">
                  <FeturedProductSlider />
                </div>
              </div>
            </div>
          </div>
          <div className="promation-wrap row margin-bottom50">
            <div className="left-side col-sm-8">
              <div
                className="promo-img"
                style={{ backgroundImage: 'url("assets/img/promo-left.png")' }}
              >
                <div className="overlay-mask" />
                <div className="promo-content">
                  <h2>INSTRUCTION</h2>
                  <p>
                    Let our experienced staff <br />
                    assist you
                  </p>
                  <button className="btn-orange one">Find Out More</button>
                </div>
              </div>
            </div>
            <div className="right-side col-sm-4">
              <div
                className="promo-img"
                style={{ backgroundImage: 'url("assets/img/promo-right.png")' }}
              >
                <div className="overlay-mask" />
                <div className="promo-content">
                  <h2>A wide range of Ammunition</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="row top-rated-product margin-bottom50">
            <div className="col-sm-12">
              <div className="home-product-silder">
                <div className="heading">
                  <h2>Top Rated Products</h2>
                </div>
                <div className="product-slider row">
                  <FeturedProductSlider />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
