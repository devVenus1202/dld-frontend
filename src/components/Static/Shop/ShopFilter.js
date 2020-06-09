import React, {Component} from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemBody,
  AccordionItemTitle,
} from 'react-accessible-accordion';
import {Dropdown, MenuItem} from 'react-bootstrap';
import Constant from "../../../config/Constant";
import {
  PRODUCT_LIST_SORT_BY_MAX_PRICE,
  PRODUCT_LIST_SORT_BY_MIN_PRICE,
  PRODUCT_LIST_SORT_BY_NEWEST, PRODUCT_LIST_SORT_BY_OLDEST,
  PRODUCT_LIST_SORT_BY_REMAINING_QUANTITY
} from "../../../constants";


const BUTTONS = {
  [PRODUCT_LIST_SORT_BY_NEWEST]: 'Newest First',
  [PRODUCT_LIST_SORT_BY_REMAINING_QUANTITY]: 'Lowest Quantity First',
  [PRODUCT_LIST_SORT_BY_MIN_PRICE]: 'Price: Low to High',
  [PRODUCT_LIST_SORT_BY_MAX_PRICE]: 'Price: High to Low',
  [PRODUCT_LIST_SORT_BY_OLDEST]: 'Oldest First'
};

const SHOW_ALL_LESS_LIMIT = 10;

class ShopFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listSelected: "active",
      gridSelected: "",
      showAllCategories: []
    };
  }

  isMobile = () => {
    return window.innerWidth <= 1040;
  };

  handleChange = (value) => {
    const {selectedSort} = this.props;
    if(+value !== +selectedSort){
      if (this.isMobile()) {
        this.props.selectCategoryModel();
      }
      this.props.onSortChange(value);
    }
  };

  selectCategoryModel = () => {
    this.props.selectCategoryModel();
  };

  render() {
    const {filtersData, selectedSort, checkedFilters, checkedCategories, onFilterChange, onCategoryChange, makeFilterId} = this.props;

    return (
      <div className="shop-top-control">
        <form className="ordering" method="get">
          <span className="title">Sort by</span>
          <Dropdown pullRight id="filter-dropdown">
            <Dropdown.Toggle variant="success">
              <span>{BUTTONS[selectedSort]}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="filters-list" bsRole="menu">
              {Object.keys(BUTTONS).map((v) => {
                const handleChange = this.handleChange;
                return <MenuItem key={`id_${Math.random()}`} onClick={() => handleChange(v)}>{BUTTONS[v]}</MenuItem>;
              })}
            </Dropdown.Menu>
          </Dropdown>
          <CategoriesCheckBoxBlock
            isMobile={this.isMobile}
            onCategoryChange={onCategoryChange}
            categories={filtersData.categories}
            checkedCategories={checkedCategories}
          />
          {filtersData.manufacturer ?
            (<FilterCheckBoxBlock
              isMobile={this.isMobile}
              makeFilterId={makeFilterId}
              key={`id_${Math.random()}`}
              filter={filtersData.manufacturer}
              onFilterChange={onFilterChange}
              checkedFilters={checkedFilters}
            />) : null
          }
          {
            filtersData.filters.map((filter) => {
              return (
                <FilterCheckBoxBlock
                  isMobile={this.isMobile}
                  makeFilterId={makeFilterId}
                  key={`id_${Math.random()}`}
                  filter={filter}
                  onFilterChange={onFilterChange}
                  checkedFilters={checkedFilters}
                />);
            })
          }
        </form>
        <div className="grid-view-mode">
        </div>
        <div className="cursor-point filterBy" onClick={this.selectCategoryModel}>
        </div>
      </div>
    );
  }
}

class FilterCheckBoxBlock extends Component {
  constructor(props) {
    super(props);

    const isMobile = props.isMobile();
    this.state = {
      showAll: false,
      collapsed: props.isMobile(),
      expanded: true
    };
  }

  onExpand = ()=>{
    /*const {expanded} = this.state
    this.setState({
      expanded: !expanded
    });*/
  }

  setShowAll = () => {
    const {showAll} = this.state;
    this.setState({
      showAll: !showAll
    });
  };

  isCheckedFilter = (filterId, filterData) => {
    const {checkedFilters, makeFilterId} = this.props;
    return Boolean(~checkedFilters.indexOf(makeFilterId(filterId, filterData)));
  };

  getFilters = () => {
    const {filter, onFilterChange} = this.props;
    const {showAll} = this.state;
    const result = [];

    let total = showAll ? filter.filterValues.length : filter.filterValues.length < SHOW_ALL_LESS_LIMIT ? filter.filterValues.length : SHOW_ALL_LESS_LIMIT;
    total--;

    for (let i = 0; i <= total; i++) {
      const filterData = filter.filterValues[i];
      const id = `filter_${filterData.filterUniqueId}`;
      result.push(
        <div key={`id_${Math.random()}`} onClick={() => onFilterChange(filter, filterData)} className="checkbox-input">
          <input
            id={id}
            className="styled"
            type="checkbox"
            name=""
            onChange={() => {
            }}
            checked={this.isCheckedFilter(filter.filterId, filterData)}
          />
          <label htmlFor={id}>{filterData.filterValue} ({filterData.filterCount})</label>
        </div>
      );
    }


    if (filter.filterValues.length > SHOW_ALL_LESS_LIMIT) {
      result.push(
        <div key={`id_${Math.random()}`} className="alignCenter">
          <a onClick={this.setShowAll.bind(this)}>{showAll ? 'SHOW LESS' : 'SHOW ALL'}</a>
        </div>
      );
    }

    return result;
  };

  render() {
    const {filter} = this.props;
    const {expanded} = this.state;
    return (
      <Accordion key={`f_${Math.random()}`} onClick={this.onExpand} className="accordion-styled" accordion={false}>
        <AccordionItem key={'0'} className="accordion-item" expanded={expanded}>
          <AccordionItemTitle className="accordion-title">
            <span>{filter.filterName}</span>
            <span className="icon"> <img alt="arrow" src={Constant.frontUrl + "/assets/img/icons/arrow-down.svg"}/> </span>
          </AccordionItemTitle>
          <AccordionItemBody className="accordion-body">
            {
              this.getFilters()
            }
          </AccordionItemBody>
        </AccordionItem>
        <hr className="checkboxHr"/>
      </Accordion>
    );
  }
}

class CategoriesCheckBoxBlock extends Component {
  constructor(props) {
    super(props);


    const isMobile = props.isMobile();
    this.state = {
      showAll: false,
      collapsed: props.isMobile(),
      expanded: true
    };
  }

  setShowAll = () => {
    const {showAll} = this.state;
    this.setState({
      showAll: !showAll
    });
  };

  isCheckedCategory(categoryId) {
    const {checkedCategories} = this.props;
    return Boolean(~checkedCategories.indexOf(`${categoryId}`));
  }

  onExpand = ()=>{
    /*const {expanded} = this.state
    this.setState({
      expanded: !expanded
    });*/
  }

  getCategories = () => {
    const {onCategoryChange, categories} = this.props;
    const {showAll} = this.state;
    const result = [];

    let total = showAll ? categories.length : categories.length < SHOW_ALL_LESS_LIMIT ? categories.length : SHOW_ALL_LESS_LIMIT;
    total--;

    for (let i = 0; i <= total; i++) {
      const {categoryName, categoryId, categoryCount} = categories[i];
      result.push(
        <div key={`id_${Math.random()}`} onClick={() => onCategoryChange(categoryId)} className="checkbox-input">
          <input
            id={`${categoryName}${categoryId}`}
            className="styled"
            type="checkbox"
            name=""
            onChange={() => {
            }}
            checked={this.isCheckedCategory(categoryId)}
          />
          <label
            htmlFor={`${categoryName}${categoryId}`}>{categoryName} {categoryCount === undefined ? '' : `(${categoryCount})`}</label>
        </div>
      );
    }

    if (categories.length > SHOW_ALL_LESS_LIMIT) {
      result.push(
        <div key={`id_${Math.random()}`} className="alignCenter">
          <a onClick={this.setShowAll.bind(this)}>{showAll ? 'SHOW LESS' : 'SHOW ALL'}</a>
        </div>
      );
    }

    return result;
  };


  render() {
    const {categories} = this.props;
    const {expanded} = this.state;

    if (!categories.length) return null;

    return (
      <Accordion className="accordion-styled" accordion={false}>
        <AccordionItem key={'0'} className="accordion-item" expanded={expanded}>
          <AccordionItemTitle className="accordion-title" onClick={this.onExpand}>
            <span>Categories</span>
            <span className="icon">
              <img alt="arrow" src={Constant.frontUrl + "/assets/img/icons/arrow-down.svg"}/>
            </span>
          </AccordionItemTitle>
          <AccordionItemBody className="accordion-body">
            {
              this.getCategories()
            }
          </AccordionItemBody>
        </AccordionItem>
        <hr className="checkboxHr"/>
      </Accordion>
    );
  }
}

export default ShopFilter;
