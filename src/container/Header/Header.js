import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Constant from "../../config/Constant";
import { AppConfig } from "../../config/AppConfig";
import { DropdownButton, MenuItem, Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import qs from "query-string";
import {
  profileInfoRequest,
  logOutRequest,
  cartListWithoutLoginRequest,
  cartListWithLoginRequest,
  categoryListRequest,
  redirectTo,
  productListAutoCompleteRequest,
  productAllDataClearRequest, productSaveLastFilters
} from "../../actions";
import InstallButton from '../../components/Static/InstallApp';
import Autocomplete from "./Autocomplete";
import { baseFilters } from "../Catalog";
import { PRODUCT_DIGITAL, PRODUCT_PHYSICAL } from "../../constants";

const ALL_CATEGORIES_TEMPLATE_ID = 'All Categories';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "Select Category",
      category: undefined,
      loggedIn: false,
      showUserProfileDropdown: false,
      showMenuDropdown: false,
      searchValue: "",
      filters: {},
      isUpdated: false,
      hideSearchBox: false,
      userImage: "",
      hideFromUrl: ['', 'webinars', 'my-gift-cards', 'terms-and-condition', 'privacy-policy', 'cart', 'faq', 'profile', 'change-password', 'address', 'orders', 'dashboard', 'unsubscribe', 'gift-cards', 'gift-card', 'gift-checkout', 'track-giftcard-logs', 'gift-orders', 'checkout'],
    };
  }

  componentWillMount() {
    const storageSession = JSON.parse(localStorage.getItem("localStorageVal"));
    if (storageSession) {
      this.props.profileInfoAction();
      this.props.cartDataWithLogin();
    } else {
      this.props.cartData();
    }
    const { location } = this.props;
    const { search } = location;

    this.showSearchBox();

    const filters = qs.parse(search);

    this.setState({
      filters,
      searchValue: filters.search || ""
    });
  }

  componentDidUpdate() {
    const { categoryListData } = this.props;
    const { isLoading, categoryList } = categoryListData;
    const { isUpdated, filters } = this.state;
    if (!isLoading && categoryList && categoryList.length && !isUpdated) {
      let selectedOption = "All Categories";
      const index = categoryList.findIndex(d => d.slug === filters.category);
      if (index > -1) {
        selectedOption = categoryList[index].categoryName;
      }
      this.setState({ isUpdated: true, selectedOption: selectedOption });
    }

  }

  showSearchBox() {
    let hideSearchBox = true;

    try {
      hideSearchBox = this.getStatus() === null;
    } catch (e) {
    }

    this.setState({
      hideSearchBox
    });

  }

  toggleUserProfile = () => {
    this.setState({
      showUserProfileDropdown: !this.state.showUserProfileDropdown
    });
  };

  componentWillReceiveProps(nextProps) {
    this.showSearchBox();

    if (this.props.location.search !== nextProps.location.search) {
      nextProps.onProductDataClear();
      const parsed = qs.parse(nextProps.location.search);
      const updateObj = {
        filters: {
          ...this.state.filters
        }
      };
      if (parsed && parsed.status) {
        updateObj.filters.status = parsed.status;
      }
      this.setState(updateObj);
    }
  }

  onAutoComplete(search) {
    const { onAutoCompleteRequest } = this.props;
    const { category } = this.state;
    this.setState({ searchValue: search });
    const request = {
      ...baseFilters,
      search,
      status: this.getStatus()
    };

    delete request.categories;
    delete request.search;

    if (category) {
      request.categories = category;
    }

    if (search) {
      request.search = search;
    }

    if (`${search}`.length >= 2 && request.status === PRODUCT_PHYSICAL) {
      onAutoCompleteRequest(request);
    }
  }

  getStatus = () => {
    const { location } = this.props;
    const { pathname } = location;

    if (`${pathname}`.endsWith('webinars') || `${pathname}`.startsWith('/digital')) {
      return PRODUCT_DIGITAL;
    }

    if (`${pathname}`.endsWith('products') || `${pathname}`.startsWith('/physical')) {
      return PRODUCT_PHYSICAL;
    }

    return null;
  };

  onSuggestionSelected = (params) => {
    const { search } = params;
    const { redirect, onAutoCompleteClear, onClearSavedFilters } = this.props;
    const { filters } = this.state;
    const categories = this.state.category || params.categories;
    params = { ...baseFilters, ...filters, ...params };

    delete params.categories;

    if (search) {
      delete params.last_filter;
      delete params.filters;
      params.search = search;
    }

    if (categories) {
      params.categories = categories;
    }

    const path = `${this.getCatalogSlug()}?${qs.stringify(params)}`;
    onClearSavedFilters();
    //onAutoCompleteClear();
    redirect(path);
  };

  getCatalogSlug = () => {
    const status = this.getStatus();
    return status === PRODUCT_PHYSICAL ? '/products' : '/webinars';
  };

  onSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const { redirect, onClearSavedFilters } = this.props;

    const { filters, searchValue } = this.state;
    const categories = this.state.category;
    const params = { ...baseFilters, ...filters, search: searchValue };

    delete params.categories;

    if (categories) {
      params.categories = categories;
    }

    const path = `${this.getCatalogSlug()}?${qs.stringify(params)}`;
    onClearSavedFilters();
    redirect(path);

  };

  logOut = () => {
    this.props.logOutAction();
    window.location.replace("/");
  };

  goToDashboard = () => {
    this.props.redirect("/dashboard");
  };

  handleSelect = eventKey => {
    if (eventKey === -1) {
      this.setState({
        selectedOption: ALL_CATEGORIES_TEMPLATE_ID,
        category: undefined
      });
      return;
    }
    this.setState({
      selectedOption: this.props.categoryListData.categoryList[eventKey].categoryName,
      category: this.props.categoryListData.categoryList[eventKey].id
    });
  };

  handleAfterLogoClick = () => {
    const {
      afterLogoClick,
    } = this.props;
    if (afterLogoClick && typeof afterLogoClick === 'function') {
      afterLogoClick();
    }
  };

  onEnterPress = (e) => {
    console.log(e.charCode);
    if (e.charCode === 13) {
      this.onSearch(e);
    }
  };

  render() {
    const {
      cartDataState,
      categoryListData,
      profileInfo,
      toggleMenuOpen,
      handleAuthOpen,
      showMenu,
      location = {},
      onProductDataClear
    } = this.props;
    let { disableLogoLink } = this.props;
    const {
      searchFocused,
      filters,
      searchValue,
    } = this.state;
    const { pathname } = location;

    let count = 0;
    if (cartDataState && cartDataState.hasOwnProperty('cartProduct') && cartDataState.cartProduct.hasOwnProperty('product')) {
      count = cartDataState.cartProduct.product.length;
    } else if (cartDataState && cartDataState.hasOwnProperty('cartProduct') && !cartDataState.cartProduct.hasOwnProperty('product')) {
      count = cartDataState.cartProduct.length;
    }
    const animateMenu = showMenu ? ' active-menu' : ' ';

    const activeDigital = (filters.status === 'digital') ? 'header-item-active' : ' ';
    const activePhysical = (filters.status === 'physical') ? 'header-item-active' : ' ';
    const activeCards = (pathname === '/gift-cards') ? 'header-item-active' : ' ';
    return (
      <Navbar collapseOnSelect fluid={true} className={`header-custom ${!this.props.webSettings.showHeader?"hidden-menu":""}`}>
        <div className={`header-flex   `}>
          <Navbar.Header>
            <Navbar.Brand className="brand-custom">
              <NavLink to={disableLogoLink ? '#' : '/'} onClick={this.handleAfterLogoClick}>
                <img
                  src={Constant.frontUrl + "/assets/img/DLD_VIP_LOGO_WHITE.png"}
                  alt="DLD_VIP_LOGO"
                />
              </NavLink>
            </Navbar.Brand>

            {
              !this.state.hideSearchBox && (
                <div className={`search-container ${searchFocused ? 'search-active' : ''}`}>
                  <span className="input-group-addon search-cat-dropdown">
                    <span
                      className="search-icon-static">
                      <img
                        src={
                          Constant.frontUrl + "/assets/img/icons/Icon_Search.svg"
                        }
                        alt=""
                      />
                    </span>
                    <DropdownButton
                      pullRight
                      title={this.state.selectedOption}
                      id={"dropdown-basic"}
                      onSelect={this.handleSelect}
                      className="cat-btn"
                    >
                      <MenuItem eventKey={-1}>All Categories</MenuItem>
                      {categoryListData && categoryListData.categoryList && categoryListData.categoryList.map((opt, i) => (
                        <MenuItem key={i} eventKey={i}>
                          {opt.categoryName}
                        </MenuItem>
                      ))}
                    </DropdownButton>
                  </span>
                  {this.state.hideSearchBox ? null :
                    <div className="header-search">
                      <div className="head-search-inner" onKeyPress={this.onEnterPress}>
                        <Autocomplete
                          suggestions={searchFocused ? this.props.suggestions : { suggestions: [] }}
                          all_categories_template_id={ALL_CATEGORIES_TEMPLATE_ID}
                          category={this.props.category}
                          searchValue={searchValue}
                          placeholder={
                            this.getStatus() === PRODUCT_DIGITAL ?
                              'Search for a Webinar keywords' : 'Search for a Product keywords'
                          }
                          onChange={value => {
                            this.onAutoComplete(value);
                          }}
                          onFocus={() => {
                            this.setState({
                              searchFocused: true,
                            });
                          }}
                          onBlur={() => {
                            this.setState({
                              searchFocused: false,
                            });
                          }}
                          onClick={this.onSuggestionSelected}
                        />
                      </div>
                      {
                        !this.state.hideSearchBox && (
                          <span
                            className="search-icon"
                            onClick={this.onSearch}
                          >
                            <img
                              src={
                                Constant.frontUrl + "/assets/img/icons/ico-back.svg"
                              }
                              alt=""
                            />
                          </span>
                        )
                      }
                    </div>
                  }
                </div>
              )
            }
          </Navbar.Header>

          <div className="headerRight">
            <Navbar.Brand className="brand-custom">
              <NavLink to={disableLogoLink ? '#' : '/'} onClick={this.handleAfterLogoClick}>
                <img
                  src={Constant.frontUrl + "/assets/img/DLD_VIP_LOGO_WHITE.png"}
                  alt="DLD_VIP_LOGO"
                />
              </NavLink>
            </Navbar.Brand>
            <ul className="nav navbar-nav navbar-right">
              <li role="presentation" className={"tool-link webinars-link"}>
                <NavLink to="/dcatalog" exact className="head-cart" onClick={() => {
                  onProductDataClear();
                  if (showMenu) {
                    toggleMenuOpen();
                  }
                }}>
                  <span className={activeDigital}>Webinars</span>
                </NavLink>
              </li>
              <li role="presentation" className={"tool-link products-link"}>
                <NavLink to="/pcatalog" exact className="head-cart" onClick={() => {
                  onProductDataClear();
                  if (showMenu) {
                    toggleMenuOpen();
                  }
                }}>
                  <span className={activePhysical}>Products</span>
                </NavLink>
              </li>
              <li role="presentation" className={"tool-link gift-card-link" + animateMenu}>
                <NavLink to="/gift-cards" exact className="head-cart" onClick={() => {
                  //onProductDataClear()
                  if (showMenu) {
                    toggleMenuOpen();
                  }
                }}>
                  <img className={activeCards}
                    src={
                      Constant.frontUrl + "/assets/img/icons/ico-giftcard.svg"
                    }
                    alt=""
                  />
                  <span className={activeCards}>Gift Cards</span>
                </NavLink>
              </li>
              <li role="presentation" className="tool-link basket-mobile">
                <NavLink to="/cart" exact className="head-cart basket-link" onClick={() => {
                  onProductDataClear();
                  if (showMenu) {
                    toggleMenuOpen();
                  }
                }}>
                  <img
                    src={
                      Constant.frontUrl + "/assets/img/icons/ico-basket-empty.svg"
                    }
                    alt=""
                  />
                  {/*<span>Cart</span>*/}
                  {count > 0 ?
                    (<div className="cart-count">
                      <span>
                        {count}
                      </span>
                    </div>)
                    : ""
                  }

                </NavLink>
              </li>
              {this.props.loginState.isLoggedIn ? (
                <li role="presentation" className={"tool-link auth-desktop" + animateMenu}>
                  <div className="auth-links">
                    <span
                      className="account-head-toggle"
                      onClick={this.toggleUserProfile}
                    >
                      <span className="account-head-desktop">My Account</span>
                      {
                        profileInfo && profileInfo.profileInfo.userImage !== ""
                          ?
                          <div className="headerProfileImg">
                            <img
                              src={AppConfig.cdn + 'user-image/' + profileInfo.profileInfo.id + '.png?timeStamp=' + profileInfo.profileInfo.updatedAt}
                              alt="" />
                          </div>
                          :
                          <img src={Constant.frontUrl + "/assets/img/icons/ico-user.svg"} alt="" />
                      }
                      <Dropdown
                        pullRight
                        defaultOpen
                        id={"user-dropdown"}
                        onToggle={this.toggleUserProfile}
                        open={this.state.showUserProfileDropdown}
                        className="account-btn reset-dropdown"
                      >
                        <Dropdown.Menu bsRole="toggle" className="hide" />
                        <Dropdown.Menu className="super-colors">
                          <MenuItem eventKey="1" onClick={this.goToDashboard}>
                            <span className="icon">
                              <img
                                alt=""
                                className="active-img"
                                src={
                                  Constant.frontUrl +
                                  "/assets/img/icons/dashboard_black.svg"
                                }
                                width="50px"
                              />
                            </span>
                            Dashboard
                          </MenuItem>
                          <MenuItem eventKey="2" href="/profile">
                            <span className="icon">
                              <img
                                alt=""
                                className="active-img"
                                src={
                                  Constant.frontUrl +
                                  "/assets/img/icons/user_black.svg"
                                }
                                width="50px"
                              />
                            </span>
                            My Profile
                          </MenuItem>
                          <MenuItem eventKey="3" onClick={this.logOut}>
                            <span className="icon">
                              <img
                                alt=""
                                className="active-img"
                                src={
                                  Constant.frontUrl +
                                  "/assets/img/icons/logout_black.svg"
                                }
                                width="50px"
                              />
                            </span>
                            Logout
                          </MenuItem>
                        </Dropdown.Menu>
                      </Dropdown>
                    </span>
                  </div>
                </li>
              ) : (
                  <li role="presentation" className={"tool-link auth-desktop" + animateMenu}>
                    <div
                      onClick={handleAuthOpen}
                      className="auth-links">
                      <img
                        src={
                          Constant.frontUrl + "/assets/img/icons/ico-user.svg"
                        }
                        alt=""
                      />
                      <span className="account-head-mobile">Sign In</span>
                    </div>
                  </li>
                )}
              <li role="presentation" className="tool-link menu-mobile-btn" onClick={toggleMenuOpen}>
                <div className="menu-link">
                  <div className={"topnav" + animateMenu} />
                </div>
              </li>
            </ul>
          </div>

        </div>
      </Navbar>
    );
  }
}

const mapStateToProps = state => {
  return {
    loginState: state.loginReducer,
    cartDataState: state.cartListWithoutLoginReducer,
    categoryListData: state.categoryListReducer,
    profileInfo: state.profileInfoReducer,
    suggestions: state.productListReducer,
    webSettings: state.webSettingsReducer
  };
};

const mapDispatchProps = dispatch => {
  return {
    profileInfoAction: () => {
      dispatch(profileInfoRequest());
    },
    logOutAction: () => {
      dispatch(logOutRequest());
    },
    cartData: () => {
      dispatch(cartListWithoutLoginRequest());
    },
    cartDataWithLogin: () => {
      dispatch(cartListWithLoginRequest());
    },
    categoryList: obj => {
      dispatch(categoryListRequest(obj));
    },
    redirect: path => {
      dispatch(redirectTo({ path: path }));
    },
    onAutoCompleteRequest: data => {
      dispatch(productListAutoCompleteRequest(data));
    },
    onAutoCompleteClear: data => {
      dispatch(productSaveLastFilters(''));
      dispatch(productAllDataClearRequest());
    },
    onClearSavedFilters: data => {
      dispatch(productSaveLastFilters(''));
    },
    onProductDataClear: data => {
      dispatch(productSaveLastFilters(''));
      dispatch(productAllDataClearRequest());
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchProps
)(Header);
