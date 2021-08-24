import React, { Component } from "react";
import { withRouter } from "react-router";
import InputRange from "react-input-range";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";

class WebinarCategoryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: { min: 10, max: 10000 },
      isSlug: false
    };
  }

  componentWillMount() {
    if (this.props.match.params.categorySlug) {
      this.setState({ isSlug: true });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.categorySlug) {
      this.setState({ isSlug: true });
    }
  }
  categoryDisplay = (categorySlug, id, parentChild) => {
    var element = document.getElementsByClassName("cat-subItem");
    var parentElement = document.getElementsByClassName("cat-item");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }

    for (var j = 0; j < parentElement.length; j++) {
      parentElement[j].classList.remove("active");
    }
    if (parentChild === "child") {
      let activeId = id.split("_");
      setTimeout(function() {
        document.getElementById("parentId_" + activeId[0]).style.display =
          "display";
        document
          .getElementById("parentId_" + activeId[0])
          .classList.add("active");
      }, 200);
    }
    this.props.categorySelected(categorySlug);
  };
  handleClear() {
    if (this.props.match.params.categorySlug) {
      this.setState({ isSlug: false });
      this.props.history.push("/shop-webinars");
    }
  }

  changeRange = value => {
    this.setState({ value });
  };

  applyFilter = () => {
    this.props.rangeFilter(this.state.value);
  };

  render() {
    const { webinarCategoryListData, categorySlugSelected } = this.props;
    return (
      <div className="sidebar col-lg-3 col-md-4 col-sm-12 col-xs-12">
        <div className="sidebar-product-filter">
          <div className="product-filter-inner">
            <div className="filter-by-categories widgets">
              <h2 className="widgettitle">Categories</h2>
              {this.state.isSlug ? (
                <div
                  className="clearFilter"
                  onClick={this.handleClear.bind(this)}
                >
                  Clear
                </div>
              ) : null}
              <ul className="product-categories-wrap">
                <Accordion>
                  {webinarCategoryListData ? (
                    webinarCategoryListData.webinarCategoryList.map(
                      (item, index) => {
                        return (
                          <AccordionItem key={index}>
                            <li
                              className={
                                categorySlugSelected === item.slug
                                  ? "active cat-item"
                                  : "cat-item"
                              }
                              key={index}
                              id={"parentId_" + index}
                            >
                              <AccordionItemTitle>
                                <div
                                  className="cat-link cursor-point"
                                  onClick={this.categoryDisplay.bind(
                                    this,
                                    item.slug,
                                    index,
                                    "parent"
                                  )}
                                >
                                  <i
                                    className="fa fa-angle-right"
                                    aria-hidden="true"
                                  />{" "}
                                  {item.categoryName}
                                </div>{" "}
                              </AccordionItemTitle>
                              <AccordionItemBody>
                                <ul>
                                  {item.categories.map(
                                    (subCategory, subIndex) => {
                                      return (
                                        <li
                                          key={subIndex}
                                          className={
                                            categorySlugSelected ===
                                            subCategory.slug
                                              ? "active cat-subItem"
                                              : "cat-subItem"
                                          }
                                          id={index + "_" + subIndex}
                                        >
                                          <div
                                            className="cat-link cursor-point"
                                            onClick={this.categoryDisplay.bind(
                                              this,
                                              subCategory.slug,
                                              index + "_" + subIndex,
                                              "child"
                                            )}
                                          >
                                            {subCategory.categoryName}
                                          </div>
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              </AccordionItemBody>
                            </li>
                          </AccordionItem>
                        );
                      }
                    )
                  ) : (
                    <li>No Category Found</li>
                  )}
                </Accordion>
              </ul>
            </div>
            <div className="filter-by-price widgets">
              <h2 className="widgettitle">
                Price <span className="font-roboto">($)</span>
              </h2>
              <div className="price-range-slider">
                <InputRange
                  maxValue={10000}
                  minValue={10}
                  value={this.state.value}
                  onChange={value => this.changeRange(value)}
                />
              </div>
              <div className="range-value-set-wrap">
                <div>
                  Min:{" "}
                  <span className="font-roboto">${this.state.value.min}</span>
                </div>
                <div>
                  Max:{" "}
                  <span className="font-roboto">${this.state.value.max}</span>
                </div>
              </div>
              <div className="price-filter-btn">
                <button className="btn-effect one" onClick={this.applyFilter}>
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(WebinarCategoryList);
