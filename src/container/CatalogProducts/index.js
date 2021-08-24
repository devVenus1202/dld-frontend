import React, { Component } from "react";
import {
  categoryListRequest,
  productListFilterRedirection,
  productListRequest,
  redirectTo,
  productListSaveStateRequest,
  productListCleared,
  settingsRequest,
  productListAutoCompleteCleared,
  productListFiltersRequest,
  productListFiltersCleared,
  productSaveLastFilters,
  productAllDataClearRequest,
  productListFailed,
  productListFiltersFailed,
  productListAutoCompleteFailed,
  webinarListFiltersFailed,
  categoryListFailed,
  hideHeader
} from "../../actions";
import { Dropdown } from "react-bootstrap";
import ShopPage from "../../components/Static/Shop/ShopPage";
import ShopFilter from "../../components/Static/Shop/ShopFilter";
import CategoryList from "../../components/Static/Shop/CategoryList";
import CategoryTable from "../../components/Static/Shop/CategoryTable";
import Search from "../../components/Static/Search";
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

export const baseFilters = {
  status: 'physical',
  sort: PRODUCT_LIST_SORT_BY_NEWEST,
  min_price: PRODUCT_LIST_MIN_PRICE,
  max_price: PRODUCT_LIST_MAX_PRICE,
  categories: [],
  filters: []
};


class CatalogProducts extends Component {
  constructor(props) {
    super(props);

    const { productListData } = props;
    const { productList } = productListData;

    this.state = {
      offset: productList?productList.length : 0,
      showCategoriesList: false,
      showCategoryToggle: false,
      filters: null,
      priceRange: {
        min: 0,
        max: AppConfig.maxAmount
      },
      baseFilters,
      isLoading: false
    };

    this.scrollWrapper = React.createRef()  
  }
  componentWillMount() {
    const {setHeaderHide} = this.props;
    setHeaderHide({showHeader:true});
  }
  componentDidMount() {
    const { onSettingsRequest, location, onLastFiltersSave } = this.props;
    const { baseFilters } = this.state;
    onSettingsRequest();
    productSaveLastFilters();
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
    const { productListData } = nextProps;
    this.updateCategoriesListVisibility();

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

  updateCategoriesListVisibility = () => {
    const { showCategoriesList, baseFilters } = this.state;
    const search = this.getSearchParams(this.props);

    if (isDigitalProduct(search)) {
      if (showCategoriesList) {
        this.onSetState({
          showCategoriesList: false
        }, 'updateCategoriesListVisibility');
      }
      return;
    }

    delete search.status;

    const updateCategoriesListValue = _.isEqual({}, search);
    if (showCategoriesList !== updateCategoriesListValue) {
      this.onSetState({
        showCategoriesList: updateCategoriesListValue
      }, 'updateCategoriesListVisibility');
    }

  };

  updateFiltersInState(filters, props, onUpdateFilters) {
    const { onProductFiltersRequest, clearProductList, productList, loadingMainData, lastFilters, location } = props;
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
    const { productList: loadMoreProducts, productListData, loadingMainData } = this.props;
    if (loadingMainData) return;

    let { filters, offset, isLoading } = this.state;
    // console.log("LoadMoreData", isLoading);

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
      callback = () => { };
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
      last_filter:
        newCategoryId
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

  saveLastFilters = (filters) => {
    const { onLastFiltersSave } = this.props;
    const url = this.getUrlForRedirect(filters);
    onLastFiltersSave(url);
  };

  getFilterUrl = (filter) => {
    return `?${qs.stringify(filter, {
      arrayFormat: 'comma',
      sort: (a, b) => a.localeCompare(b)
    })}`;
  }

  redirect = (filters) => {
    const { redirect } = this.props;
    // this.saveLastFilters(filters);
    const newUrl = this.getUrlForRedirect(filters);

    if (this.getFilterUrl(filters) !== this.props.lastFilters){
      this.setState({offset:0})
      redirect(newUrl);
    }
     
  };

  toggleCategoryMenu = () => {
    this.onSetState({
      showCategoryToggle: !this.state.showCategoryToggle
    }, 'toggleCategoryMenu');
  };

  onChangeScroll = (event) => {
    const scrollY = event.target.scrollTop;
    if (scrollY < 120) {
      //show header
      if (!this.props.webSettings.showHeader)
        this.props.setHeaderHide({showHeader: true})
    } else {
      if (this.props.webSettings.showHeader)
        this.props.setHeaderHide({showHeader: false})
      // hide 
    }
  }

  renderList() {
    const { productListData, categoryListData, history, filtersData, onLastFiltersSave } = this.props;
    let {
      productList,
      loadingMainData,
      totalProduct
    } = productListData;

    const { showCategoriesList, filters, showCategoryToggle, priceRange, offset, isLoading } = this.state;
    if (!filters) {
      return null;
    }
    const { sort, min_price, max_price, status, category } = filters;

    const hasMore = totalProduct <= AppConfig.PRODUCTS_PER_PAGE ? false : totalProduct > offset && !isLoading;
    return (
      <section className="shop-page margin50" ref={(ref) => this._div = ref}>
        <div className="row sidebar-scroll-fix" ref={node => {
          this.sidebar = node;
        }} >
          <div className="shop-main-container clearfix">

            {showCategoriesList ? (
              <CategoryTable
                settings={this.props.settings}
                categoryListData={categoryListData}
                onCategoryChange={this.onCategoryChange}
                category={category}
              />
            ) :
              (
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
              )
            }

            {!showCategoriesList ? (
              <div id="minHigh" className={`minHight main-content col-lg-9 col-md-8 col-sm-12 col-xs-12 has-sidebar ${this.props.webSettings.showHeader?"":"no-header"}`}>

                {/* {loadingMainData ? <Loader /> : null} */}

                {productList.length > 0 ?
                  (
                    <div className={"text-center paginationCatalog"}>
                      <div id="scrollableProductDiv" className="scroldiv" ref={ (ref) => this.scrollWrapper = ref } onScroll={this.onChangeScroll}>
                        <InfiniteScroll
                          dataLength={productList.length} //This is important field to render the next data
                          next={this.loadMoreData}
                          hasMore={hasMore}
                          loader={<InfiniteLoader />}
                          scrollThreshold={0.9}
                          scrollableTarget="scrollableProductDiv"
                          initialScrollY = {Number(window.localStorage.getItem("lastScrollPosition"))}
                        >
                          <ShopPage
                            saveScrollTop={this.saveScrollTop}
                            history={history}
                            location = {this.props.location}
                            onLastFiltersSave={onLastFiltersSave}
                            productListData={productListData}
                            onViewChange={this.onViewChange}
                            scrollView = {this.scrollWrapper}
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
            ) : null}

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
                className={`MenuList-btn ${this.props.webSettings.showHeader?"":"no-header"}`}
                onToggle={this.toggleCategoryMenu}
              >
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
    productListData: state.productListReducer,
    categoryListData: state.categoryListReducer,
    settings: state.settingsReducer,
    filtersData: state.productListReducer.filtersData,
    lastFilters: state.productListReducer.lastFilters,
    webSettings: state.webSettingsReducer
  };
};
const mapDispatchProps = dispatch => {
  return {
    productList: data => {
      if (data.m === 'updateFilters') {
        dispatch(productListFailed());
      }
      return dispatch(productListRequest(data));
    },
    onProductFiltersRequest: data => {
      if (data.m === 'updateFilters') {
        dispatch(productListFiltersFailed());
      }
      dispatch(productListFiltersRequest(data));
    },
    saveProductsState: data => {
      dispatch(productListSaveStateRequest(data));
    },
    clearProductList: () => {
      dispatch(productListCleared());
    },
    clearProductFilters: () => {
      dispatch(productListFiltersCleared());
    },
    onAutoCompleteClear: data => {
      dispatch(productListAutoCompleteCleared(data));
    },
    onLastFiltersSave: data => {
      dispatch(productSaveLastFilters(data));
    },
    onCategoryList: (obj) => {
      dispatch(categoryListFailed());
      dispatch(categoryListRequest(obj));
    },
    onCancelAllRequests: (obj) => {
      dispatch(productListFailed());
      dispatch(productListFiltersFailed());
      dispatch(productListAutoCompleteFailed({}));
    },
    productListFilterRedirection: categorySlug => {
      dispatch(productListFilterRedirection(categorySlug));
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
)(CatalogProducts);