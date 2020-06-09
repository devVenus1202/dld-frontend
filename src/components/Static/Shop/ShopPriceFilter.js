import React, {Component} from "react";
import InputRange from "react-input-range";
import {withRouter} from "react-router";
import _ from "lodash";
import "react-accessible-accordion/dist/fancy-example.css";
import {AppConfig} from "../../../config/AppConfig";

class PriseFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 0,
      max: 0
    };
  }

  componentWillMount() {
    this.onPriceRangeChange(this.props.priceRange);
  }

  componentWillUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.priceRange, this.props.priceRange)) {
      this.onPriceRangeChange(nextProps.priceRange);
    }
  }

  onMinPriceChange = (e) => {
    const {max} = this.state;
    const {maxValue} = this.props;
    if (+max >= +e.target.value) {
      this.onPriceRangeChange({
        min: e.target.value
      });
    }
  };

  onMaxPriceChange = (e) => {
    const {min} = this.state;
    const {minValue} = this.props;
    if (+min <= +e.target.value) {
      this.onPriceRangeChange({
        max: e.target.value
      });
    }
  };

  onPriceRangeApply = () => {
    const {onPriceRangeChange} = this.props;
    onPriceRangeChange(this.state);
  };

  onPriceRangeChange = (range) => {
    this.setState({...this.state, ...range});
  };

  render() {
    const {min, max} = this.state;
    const {maxValue, minValue} = this.props;

    return (
      <div className="sidebar-product-filter price-filter">
        <div className="product-filter-inner">

          <div className="filter-by-price widgets">
            <h2 className="widgettitle">
              Price in USD
            </h2>
            <div className="range-value-set-wrap">
              <div>
                {" "}
                <input
                  type="text"
                  value={+min}
                  onChange={this.onMinPriceChange}
                />
              </div>
              <span className="range-value-spacer">-</span>
              <div>
                {" "}
                <input
                  type="text"
                  value={+max}
                  onChange={this.onMaxPriceChange}
                />
              </div>
              <button onClick={this.onPriceRangeApply}>ok</button>
            </div>
            <div className="price-range-slider">
              <InputRange
                maxValue={+maxValue}
                minValue={+minValue}
                value={{min: +min, max: +max}}
                onChange={v => this.onPriceRangeChange(v)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(PriseFilter);
