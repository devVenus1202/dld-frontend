import React, { Component } from "react";
import {

} from "../../actions";
import { Dropdown } from "react-bootstrap";
import ShopPage from "../../components/Static/Shop/ShopPage";
import ShopFilter from "../../components/Static/Shop/ShopFilter";
import PriceFilter from "../../components/Static/Shop/ShopPriceFilter";
import { connect } from "react-redux";
import _ from "lodash";
import { AppConfig } from "../../config/AppConfig";
import { InfiniteLoader, Loader } from "../../components/Static/Common/Loader/Loader";
import qs from "query-string";
import InfiniteScroll from "react-infinite-scroll-component";
import { isDigitalProduct, isPhysicalProduct } from "../../helpers/product";
import {
  PRODUCT_DIGITAL,
  PRODUCT_LIST_MAX_PRICE,
  PRODUCT_LIST_MIN_PRICE,
  PRODUCT_LIST_SORT_BY_NEWEST,
  PRODUCT_PHYSICAL
} from "../../constants";
import {webinarListRequest} from "../../actions";
import {webinarListFiltersRequest} from "../../actions";
import {productListSaveStateRequest} from "../../actions";
import {webinarListCleared} from "../../actions";
import {webinarListFiltersCleared} from "../../actions";
import {productSaveLastFilters} from "../../actions";
import {categoryListRequest} from "../../actions";
import {productListFailed} from "../../actions";
import {productListFiltersFailed} from "../../actions";
import {settingsRequest} from "../../actions";
import {webinarListFailed} from "../../actions";
import {webinarListFiltersFailed} from "../../actions";
import {redirectTo} from "../../actions";
import {categoryListFailed} from "../../actions";
import {hideHeader} from "../../actions";

export const baseFilters = {
  status: PRODUCT_DIGITAL,
  sort: PRODUCT_LIST_SORT_BY_NEWEST,
  min_price: PRODUCT_LIST_MIN_PRICE,
  max_price: PRODUCT_LIST_MAX_PRICE,
  categories: [],
  filters: []
};


class CatalogWebinars extends Component {
  constructor(props) {
    super(props);

    const { productListData } = props;
    const { productList } = productListData;

    this.state = {
      offset: productList ? productList.length : 0,
      filters: null,
      showCategoryToggle: false,
      priceRange: {
        min: 0,
        max: AppConfig.maxAmount
      },
      baseFilters
    };
    this.scrollWrapper = React.createRef()
  }

  componentWillMount() {
    const {setHeaderHide} = this.props;
    setHeaderHide({showHeader:true});
  }
  componentDidMount() {
    const {onSettingsRequest, location, onLastFiltersSave, setHeaderHide} = this.props;
    const {baseFilters, check} = this.state;
    onSettingsRequest();

    const search = this.getSearchParams(this.props);

    const filters = {
      ...baseFilters,
      ...search
    };

    this.updateFiltersInState(filters, this.props, () => {
      this.loadCategories();
    });

    onLastFiltersSave(location.search);
    
  }

  componentWillUpdate(nextProps, nextState) {
    const { baseFilters } = this.state;
    const newSearch = this.getSearchParams(nextProps);
    const oldSearch = this.getSearchParams(this.props);

    if (!_.isEqual(newSearch, oldSearch)) {
      this.updateFiltersInState({ ...baseFilters, ...newSearch }, nextProps);
    }
  }

  componentWillUnmount() {
    window.onscroll = null;
  }

  clear() {
    const { onAutoCompleteClear, clearProductList, clearProductFilters, onCancelAllRequests } = this.props;
    onCancelAllRequests();
    clearProductList();
    clearProductFilters();
    onAutoCompleteClear();
  }

  getSearchParams(props) {

    return qs.parse(props.location.search, {
      arrayFormat: 'comma',
    });

  }

  loadCategories() {
    const { onCategoryList } = this.props;
    const { status } = this.state.filters;

    onCategoryList({
      status
    });
  }

  updateFiltersInState(filters, props, onUpdateFilters) {
    const { onProductFiltersRequest, productList, loadingMainData, lastFilters } = props;
    filters = { ...filters };

    if (!isDigitalProduct(filters) && !isPhysicalProduct(filters)) {
      filters = PRODUCT_PHYSICAL;
    }

    if (!Array.isArray(filters.categories)) {
      filters.categories = filters.categories ? [filters.categories] : [];
    }

    if (!Array.isArray(filters.filters)) {
      filters.filters = filters.filters ? [filters.filters] : [];
    }

    this.onSetState({
      filters
    }, () => {
      const data = { ...this.removeFiltersEmptyValues({ ...filters }), 'm': 'updateFilters' };

      if (!~[PRODUCT_PHYSICAL, PRODUCT_DIGITAL].indexOf(lastFilters)) {
        onProductFiltersRequest(data);
        if (!loadingMainData) {
          productList(data);
        }
        if (onUpdateFilters) {
          onUpdateFilters();
        }
      }
    }, 'updateFilters');
  }

  saveScrollTop = () => {
    const currentSearch = this.props.location.search;
    const parsed = qs.parse(currentSearch);
    this.props.saveProductsState({
      savedState: {
        hasLeftPage: true,
        status: parsed.status
      }
    });
  };

  loadMoreData = () => {

    const { productList: loadMoreProducts } = this.props;
    let { filters, offset } = this.state;

    filters = {
      ...filters
    };

    offset = offset + AppConfig.PRODUCTS_PER_PAGE;

    this.onSetState({
      offset
    });

    this.removeFiltersEmptyValues(filters);

    loadMoreProducts({ ...filters, offset, 'm': 'loadMoreData' });
  };

  onSetState(state, callback) {
    if (typeof callback !== 'function') {
      callback = () => {
      };
    }
    this.setState(state,
      callback
    );
  }

  onViewChange = e => {
    this.onSetState({
      modeList: e
    }, 'onViewChange');
  };

  onSortChange = sort => {
    this.redirect({
      ...this.state.filters,
      sort
    });
  };

  makeFilterId = (last_filter, filterData) => {
    return `f${last_filter}_${filterData.filterUniqueId}`;
  };

  onFilterChange = ({ filterId: last_filter }, filterData) => {
    let { filters } = this.state;

    let deleted = false;
    const f = this.makeFilterId(last_filter, filterData);
    const filterParams = filters.filters.filter(filter => {
      if (f === filter) {
        deleted = true;
        return false;
      }
      return true;
    });

    if (!deleted) {
      filterParams.push(f);
    }

    filters = {
      ...filters,
      filters: filterParams,
      last_filter: f
    };

    this.redirect(filters);
  };

  onCategoryChange = (newCategoryId) => {
    let { filters } = this.state;

    let deleted = false;

    const categories = filters.categories.filter(categoryId => {
      if (+categoryId === +newCategoryId) {
        deleted = true;
        return false;
      }

      return true;
    });

    if (!deleted) {
      categories.push(`${newCategoryId}`);
    }

    filters = {
      ...filters,
      categories,
      last_filter: newCategoryId
    };

    this.redirect(filters);
  };

  onPriceRangeChange = ({ min, max }) => {
    let { filters } = this.state;

    filters = {
      ...filters,
      min_price: min,
      max_price: max
    };
    this.redirect(filters);
  };

  removeFiltersEmptyValues(filters) {
    if (filters.filters && !filters.filters.length) {
      delete filters.filters;
    }

    if (filters.categories && !filters.categories.length) {
      delete filters.categories;
    }

    return filters;
  }


  getUrlForRedirect = (filters) => {
    const { location } = this.props;
    return `${location.pathname}?${qs.stringify(filters, {
      arrayFormat: 'comma',
      sort: (a, b) => a.localeCompare(b)
    })}`;
  };

  getFilterUrl = (filter) => {
    return `?${qs.stringify(filter, {
      arrayFormat: 'comma',
      sort: (a, b) => a.localeCompare(b)
    })}`;
  }

  redirect = (filters) => {
    const {redirect, clearProductList} = this.props;
    const newUrl = this.getUrlForRedirect(filters);

    console.log(this.getFilterUrl(filters) );
    console.log(this.props.lastFilters);
    if (this.getFilterUrl(filters) !== this.props.lastFilters){
      this.setState({offset:0})
      redirect(newUrl);
      clearProductList();
    }
     
  };

  toggleCategoryMenu = () => {
    this.onSetState({
      showCategoryToggle: !this.state.showCategoryToggle
    });
  };


  onChangeScroll = (event) => {
    const scrollY = event.target.scrollTop;
    if (scrollY < 120) {
      //show header
      if (!this.props.showHeader)
        this.props.setHeaderHide({showHeader: true})
    } else {
      if (this.props.showHeader)
        this.props.setHeaderHide({showHeader: false})
      // hide 
    }
  }

  renderList() {
    const { productListData, history, filtersData, onLastFiltersSave } = this.props;

    let {
      productList,
      loadingMainData,
      totalProduct
    } = productListData;
    const { filters, showCategoryToggle, priceRange, offset } = this.state;

    if (!filters) {
      return null;
    }

    const { sort, min_price, max_price, status, category } = filters;

    console.log("offset", offset);
    return (
      <section className="shop-page margin50" ref={(ref) => this._div = ref}>
        <div className="row sidebar-scroll-fix" ref={node => {
          this.sidebar = node;
        }}>
          <div className="shop-main-container clearfix">

            <div className="sidebar col-lg-3 col-md-4 col-sm-12 col-xs-12">
              <div className="sidebar-scroll-fix catalog">
                <div className="sidebar-title-block">
                  <h3 className="shop-title">{status === 'physical' ? 'Products' : 'Webinars'}</h3>
                  <span className="result-count">
                    <b>{totalProduct}</b> results
                    </span>
                </div>
                <PriceFilter
                  onPriceRangeChange={this.onPriceRangeChange}
                  priceRange={{ min: min_price, max: max_price }}
                  maxValue={priceRange.max}
                  minValue={priceRange.min}
                />
                <ShopFilter
                  mode={"table"}
                  onViewChange={this.onViewChange}
                  filtersData={filtersData}
                  checkedFilters={filters.filters}
                  checkedCategories={filters.categories}
                  onSortChange={this.onSortChange}
                  selectedSort={+sort}
                  onFilterChange={this.onFilterChange}
                  makeFilterId={this.makeFilterId}
                  onCategoryChange={this.onCategoryChange}
                  selectCategoryModel={this.toggleCategoryMenu}
                />
              </div>
            </div>


            <div id="minHigh" className={`minHight main-content col-lg-9 col-md-8 col-sm-12 col-xs-12 has-sidebar ${this.props.showHeader?"":"no-header"}`}>
              {/* {loadingMainData ? <Loader/> : null} */}
              {productList.length > 0 ?
                (
                  <div className={"text-center paginationCatalog"}>
                    <div id="scrollableDivWebinar" className="scroldiv"  onScroll={this.onChangeScroll}>
                      <InfiniteScroll
                        dataLength={productList.length} //This is important field to render the next data
                        next={this.loadMoreData}
                        hasMore={totalProduct <= AppConfig.PRODUCTS_PER_PAGE ? false : totalProduct > offset}
                        loader={<InfiniteLoader />}
                        scrollableTarget="scrollableDivWebinar"
                        scrollThreshold={0.9}
                        initialScrollY={Number(window.localStorage.getItem("lastScrollPosition"))}
                      >
                        <ShopPage
                          saveScrollTop={this.saveScrollTop}
                          history={history}
                          onLastFiltersSave={onLastFiltersSave}
                          productListData={productListData}
                          onViewChange={this.onViewChange}
                          scrollView={this.scrollWrapper}

                        />
                      </InfiniteScroll>
                    </div>
                  </div>
                ) : null
              }

              {productList.length === 0 ?
                (
                  <div className="no-product-found">
                    <div className="noresult-block">
                      <div className="noresult-img no-result-img-block">
                        <img alt="" src={AppConfig.frontUrl + "/assets/img/empty-product.png"} />
                      </div>
                      <div className="noresult-content">
                        <h4>Sorry, No Product Available</h4>
                      </div>
                    </div>
                  </div>
                ) : null
              }
            </div>

            <div className="mobile-second-menu">
              {showCategoryToggle && <div className="close-btn" onClick={this.toggleCategoryMenu}>
                <img src={AppConfig.frontUrl + "/assets/img/icons/ico-close-black.svg"} alt="" />
              </div>}
              <div className="filters-title-block">
                <span className="result-count">
                  {totalProduct} results
                </span>
              </div>
              <Dropdown
                pullRight
                defaultOpen
                id={"user-category-dropdown"}
                open={this.state.showCategoryToggle}
                className={`MenuList-btn ${this.props.showHeader?"":"no-header"}`}
                onToggle={this.toggleCategoryMenu}>

                <Dropdown.Toggle bsRole="toggle">
                  <div className="close-icon-black" />
                </Dropdown.Toggle>

                <Dropdown.Menu className="menu-dropdown-list" bsRole="menu">

                  <div className="filterSidebar">
                    <i className="fa fa-filter" aria-hidden="true" />{" "}
                    <span>Filter By</span>
                  </div>
                  <div className="mobile-filter-cover">
                    <PriceFilter
                      onPriceRangeChange={this.onPriceRangeChange}
                      priceRange={{ min: min_price, max: max_price }}
                      maxValue={priceRange.max}
                      minValue={priceRange.min}
                    />
                    <ShopFilter
                      mode={"table"}
                      onViewChange={this.onViewChange}
                      checkedFilters={filters.filters}
                      checkedCategories={filters.categories}
                      filtersData={filtersData}
                      onSortChange={this.onSortChange}
                      selectedSort={+sort}
                      onFilterChange={this.onFilterChange}
                      makeFilterId={this.makeFilterId}
                      onCategoryChange={this.onCategoryChange}
                      selectCategoryModel={this.toggleCategoryMenu}
                    />
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </section>
    );
  }

  render() {
    return this.renderList();
  }
}

const mapStateToProps = state => {
  return {
    productListData: state.webinarListReducer,
    categoryListData: state.categoryListReducer,
    settings: state.settingsReducer,
    filtersData: state.webinarListReducer.filtersData,
    lastFilters: state.productListReducer.lastFilters,
    showHeader: state.webSettingsReducer.showHeader
  };
};

const mapDispatchProps = dispatch => {
  return {
    productList: data => {
      if (data.m === 'updateFilters') {
        dispatch(webinarListFailed());
      }
      return dispatch(webinarListRequest(data));
    },
    onProductFiltersRequest: data => {
      if (data.m === 'updateFilters') {
        dispatch(webinarListFiltersFailed());
      }
      dispatch(webinarListFiltersRequest(data));
    },
    saveProductsState: data => {
      dispatch(productListSaveStateRequest(data));
    },
    clearProductList: () => {
      dispatch(webinarListCleared());
    },
    clearProductFilters: () => {
      dispatch(webinarListFiltersCleared());
    },
    onLastFiltersSave: data => {
      dispatch(productSaveLastFilters(data));
    },
    onCategoryList: (obj) => {
      dispatch(categoryListFailed());
      dispatch(categoryListRequest(obj));
    },
    onCancelAllRequests: (obj) => {
      dispatch(webinarListFailed());
      dispatch(webinarListFiltersFailed());
    },
    onSettingsRequest: data => {
      dispatch(settingsRequest(data));
    },
    setHeaderHide: data => {
      dispatch(hideHeader(data));
    },
    redirect: path => {
      dispatch(
        redirectTo({
          path: path
        })
      );
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchProps
)(CatalogWebinars);
