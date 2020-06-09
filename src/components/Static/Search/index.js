import React, {Component} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import qs from "query-string";
import classNames from 'classnames';
import {Dropdown} from "react-bootstrap";
import * as Style from "./Search.css";
import Constant from "../../../config/Constant";
import {redirectTo} from "../../../actions";
import {Accordion, AccordionItem, AccordionItemBody, AccordionItemTitle} from "react-accessible-accordion";

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearch: false,
            searchValue: '',
            categorySlug: props.categorySlugSelected || null,
        };
    }

    componentWillMount() {
        const {location} = this.props;
        const {search} = location;


        const filters = qs.parse(search);

        this.setState({
            filters: filters,
            searchValue: filters.search || ""
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hideSearchInput) {
            this.setState({
                showSearch: false,
            });
        }
    }

    toggleShowSearchOpen = () => {
        this.setState((previousState) => ({showSearch: !previousState.showSearch}))
    };

    onSearch = e => {
        e.preventDefault();

        const {redirect, location, match} = this.props;
        const {pathname} = location;
        let {params} = match;
        let catalogDetailPage;

        if (params) {
            catalogDetailPage = params.catalog;
        }

        const {searchValue, category, filters} = this.state;

        if (pathname === "/catalog") {
            params = {...filters, search: searchValue, category: category || ""};

            const path = pathname + "?" + qs.stringify(params);

            redirect(path);
        } else if (catalogDetailPage) {
            params = {search: searchValue, category};

            const path = "/" + catalogDetailPage + "s?" + qs.stringify(params);

            redirect(path);
        }

        this.toggleShowSearchOpen();
    };

    storeSelectedCategory = (categorySlug) => {
        this.setState({
            categorySlug,
        });
    };

    categoryDisplay = () => {
        this.props.handleSearch({
            category: this.state.categorySlug,
            search: this.state.searchValue,
        });

        this.toggleShowSearchOpen();
    };

    render() {
        const {
            catalog,
            categoryListData,
        } = this.props;
        const {
            showSearch,
            categorySlug: categorySlugSelected,
        } = this.state;

        return (
            <div className={classNames(Style["search-cover"], Style[`${(showSearch === true) && "openSearch"}`])}>
                <div className={Style["search-btn-mobile"]} onClick={this.toggleShowSearchOpen}>
                    {
                        showSearch ? (
                            <img
                                src={
                                    Constant.frontUrl + "/assets/img/icons/ico-close-black.svg"
                                }
                                alt=""
                            />
                        ) : (
                            <img
                                src={
                                    Constant.frontUrl + "/assets/img/icons/ico-search-black.svg"
                                }
                                alt=""
                            />
                        )
                    }
                </div>
                {
                    showSearch && (
                        <div className={Style["search-content-container"]}>
                            <div className={Style["search-field-container"]}>
                                <img
                                    src={
                                        Constant.frontUrl + "/assets/img/icons/ico-search-black.svg"
                                    }
                                    alt=""/>
                                <input
                                    type="text"
                                    className={Style["search-control"]}
                                    placeholder="Product keywords or Category"
                                    value={this.state.searchValue}
                                    onInput={e => {
                                        if (e.keyCode !== 13) {
                                            this.setState({searchValue: e.target.value});
                                        }
                                    }}
                                    onKeyUp={e => {
                                        if (e.keyCode === 13) {
                                            return this.categoryDisplay();
                                        }
                                    }}
                                />
                            </div>
                            <h3>Search in</h3>
                            <Dropdown
                                pullRight
                                id={"search-category-dropdown"}
                                open={this.state.showCategoryToggle}
                                onToggle={this.toggleCategoryMenu}
                                className={Style["search-category-dropdown"]}
                            >
                                <Dropdown.Toggle bsRole="toggle">{categorySlugSelected ? categorySlugSelected.charAt(0).toUpperCase() + categorySlugSelected.slice(1) : 'All Categories'}</Dropdown.Toggle>
                                <Dropdown.Menu bsRole="menu">
                                    <ul className="product-categories-wrap">
                                        <Accordion>
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
                                                            onClick={this.storeSelectedCategory.bind(this, null)}
                                                        >
                                                            {" "}
                                                            All {catalog}
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
                                                            <AccordionItem key={index}>
                                                                <li
                                                                    ref={node => {this.accLi = node}}
                                                                    className={
                                                                        classNames('cat-item', {active: categorySlugSelected === item.slug})
                                                                    }
                                                                    key={index}
                                                                    id={"parentId_" + index}
                                                                >
                                                                    <AccordionItemTitle>
                                                                        <div
                                                                            className={classNames(
                                                                                'cat-link',
                                                                                'cursor-point',
                                                                            )}
                                                                            onClick={this.storeSelectedCategory.bind(
                                                                                this,
                                                                                item.slug,
                                                                                index,
                                                                                "parent"
                                                                            )}
                                                                        >
                                                                            {" "}
                                                                            {item.categoryName} ({item.count})
                                                                        </div>
                                                                        {" "}
                                                                    </AccordionItemTitle>
                                                                    <AccordionItemBody>
                                                                        <ul>
                                                                            {item.categories.map(
                                                                                (subCategory, subIndex) => {
                                                                                    return (
                                                                                        <li
                                                                                            key={subIndex}
                                                                                            className={
                                                                                                classNames(
                                                                                                    'cat-subItem',
                                                                                                    `cat-subItem-${index}-${subIndex}`,
                                                                                                    {active: categorySlugSelected === subCategory.slug},
                                                                                                )
                                                                                            }
                                                                                            id={index + "_" + subIndex}
                                                                                        >
                                                                                            <div
                                                                                                className={classNames(
                                                                                                    'cat-link',
                                                                                                    'cursor-point',
                                                                                                )}
                                                                                                onClick={this.storeSelectedCategory.bind(
                                                                                                    this,
                                                                                                    subCategory.slug,
                                                                                                    index + "_" + subIndex,
                                                                                                    "child"
                                                                                                )}
                                                                                            >
                                                                                                {subCategory.categoryName} ({subCategory.count})
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
                                                    })
                                                ) : null
                                            ) : (
                                                <li>No Category Found</li>
                                            )}
                                        </Accordion>
                                    </ul>
                                </Dropdown.Menu>
                            </Dropdown>
                            <div className={Style["search-button-container"]}>
                                <button onClick={this.categoryDisplay}>Search</button>
                            </div>

                        </div>
                    )
                }
            </div>
        );
    }
}

export default compose(
    connect(
        (state, router) => {
            return {
                ...router,
            };
        },
        dispatch => ({
            redirect: path => {
                dispatch(redirectTo({path: path}));
            },
        }),
    ),
    withRouter,
)(Search);
