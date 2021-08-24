import React, {Component} from "react";
import {Dropdown} from "react-bootstrap";
import {withRouter} from "react-router";
import qs from "query-string";
import classNames from 'classnames';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";

class CategoryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: {min: this.props.priceRange.min, max: this.props.priceRange.max},
      isSlug: false,
    };
  }

  componentWillMount() {
    const {location} = this.props;
    const parsed = qs.parse(location.search);
    this.setState({isSlug: parsed.category !== "" && parsed.category !== undefined});
  }

  componentWillReceiveProps(nextProps) {
    const {location} = nextProps;
    const parsed = qs.parse(location.search);
    this.setState({isSlug: !!parsed.category});
  }

  handleClear() {
    this.props.removeQueryParameter();
    this.props.clearProductList();
    this.categoryDisplay(null);
  }

  categoryDisplay = (categorySlug) => {
    // const el = document.querySelector('.sidebar-scroll-fix');
    //
    // el.click();

    this.props.categorySelected(categorySlug);
  };

  render() {

    const {categoryListData, categorySlugSelected, typeProduct} = this.props;

    let selectedCategoryName = '';
    if (!categoryListData.isLoading) {
      let selectedCategory;

      categoryListData && categoryListData.categoryList && categoryListData.categoryList.some(c => {
        let result;

        if (c.slug === categorySlugSelected) {
          selectedCategory = c;
          result = true;
        }

        if (result) {
          return result;
        }

        if (c.categories && c.categories.length) {
          c.categories.some(sc => {
            if (sc.slug === categorySlugSelected) {
              selectedCategory = sc;
              result = true;
            }

            return result;
          });
        }

        return result;
      });

      if (selectedCategory) {
        selectedCategoryName = selectedCategory.categoryName;
      } else {
        selectedCategoryName = 'All Categories';
      }
    }

    return (
      <div className="sidebar-product-filter">
        <div className="product-filter-inner">

          <div className="filter-by-categories widgets">
            <div>
              <h2 className="widgettitle categories">Category</h2>
              {this.state.isSlug ? (
                <div
                  className="clearFilter"
                  onClick={this.handleClear.bind(this)}
                >
                  <span>reset</span> <span className="reset-icon"/>
                </div>
              ) : null}
            </div>
            <Dropdown
              pullRight
              id={"category-dropdown"}
            >
              <Dropdown.Toggle bsRole="toggle" className="categoryDropdown">
                <span className="categoryName">  {
                  categorySlugSelected
                    ? selectedCategoryName
                    : 'All Categories'
                }
              </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="" bsRole="menu">
                <ul className="product-categories-wrap">
                  <Accordion
                    preExpanded={['2', '4', '7', '13']}
                    accordion={false}
                  >
                    <AccordionItem key={-1}>
                      <li
                        className={classNames('cat-item', {'active': !categorySlugSelected})}
                      >
                        <AccordionItemTitle>
                          <div
                            className={classNames(
                              'cat-link',
                              'cursor-point',
                            )}
                            onClick={this.categoryDisplay.bind(this, null)}
                          >
                            {" "}
                            All
                          </div>
                          {" "}
                        </AccordionItemTitle>
                      </li>
                    </AccordionItem>
                    {categoryListData ? (
                      categoryListData.isLoading ? (
                        <p>Loading Categories....</p>
                      ) : (categoryListData.categoryList && categoryListData.categoryList.length) ? (
                        categoryListData.categoryList.map((item, index) => {
                          return (
                            <AccordionItem key={index} expanded>
                              <li
                                className={
                                  classNames('cat-item', {active: categorySlugSelected === item.slug})
                                }
                                id={"parentId_" + index}
                              >
                                <AccordionItemTitle>
                                  <div
                                    className={classNames(
                                      'cat-link',
                                      'cursor-point',
                                    )}
                                    onClick={this.categoryDisplay.bind(
                                      this,
                                      item.slug,
                                      item,
                                      "parent"
                                    )}
                                  >
                                    {" "}
                                    {item.categoryName} ({item.count})
                                  </div>
                                  {" "}
                                </AccordionItemTitle>
                              </li>
                            </AccordionItem>
                          );
                        })
                      ) : null
                    ) : (
                      <li>No Category Found</li>
                    )}
                  </Accordion>
                </ul>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CategoryList);
