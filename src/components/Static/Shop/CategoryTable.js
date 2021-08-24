import React, {Component} from "react";
import {withRouter} from "react-router";
import qs from "query-string";
import classNames from 'classnames';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import Footer from '../../../container/Footer/Footer';
import {
  hideHeader
} from "../../../actions";
import { connect } from "react-redux";

class CategoryTable extends Component {
  constructor(props) {
    super(props);
    /*this.state = {
      value: {min: this.props.priceRange.min, max: this.props.priceRange.max},
      isSlug: false,
    };*/
  }

    componentWillMount() {
      const {setHeaderHide} = this.props;
      setHeaderHide({showHeader:true});
    }
/*  componentWillMount() {
    const {location} = this.props;
    const parsed = qs.parse(location.search);

    if (parsed.category !== "" && parsed.category !== undefined) {
      this.setState({isSlug: true});
    }
  }*/

/*  componentWillReceiveProps(nextProps) {
    const {location} = nextProps;
    const parsed = qs.parse(location.search);
    if (parsed.category) {
      this.setState({isSlug: true});
    } else {
      this.setState({isSlug: false});
    }
  }*/

  onCategoryChange = (id) => {
    const {onCategoryChange} = this.props;
/*    const el = document.querySelector('.sidebar-scroll-fix');

    el.click();*/
    onCategoryChange(id);
    //this.props.categorySelected(id);
  };


  render() {
    const {categoryListData, category} = this.props;

    const SIZE = Math.ceil(categoryListData.categoryList.length / 3);
    const chunkResults = categoryListData.categoryList.reduce((p, c) => {
      if (p[p.length - 1].length === SIZE) {
        p.push([]);
      }
      p[p.length - 1].push(c);
      return p;
    }, [[]]);

    return (
      (categoryListData && categoryListData.categoryList.length > 0)
        ? (
          <div className="new_categories_shop_list widgets">
            <div className="container">
              <h1>Products Categories</h1>
              <div className="product-categories-container">
                {chunkResults &&
                chunkResults.map((list, listIndex) => {
                  return (<ul key={`id_${Math.random()}`} className="new-categories-wrap product-categories-wrap">
                    <Accordion accordion={false} >
                      {(list.map((item, index) => {
                        return (
                          <AccordionItem key={index} expanded>
                            <li className={classNames('cat-item2', {active: category === item.id})} id={"parentId_" + index} >
                              <AccordionItemTitle className="accordion__title2">
                                <div className={classNames('cat-link','cursor-point')} onClick={this.onCategoryChange.bind(this, item.id)}>
                                  {" "}
                                  <span>{item.categoryName}</span> <span
                                  className="new-categories-count">{item.count}</span>
                                </div>
                              </AccordionItemTitle>
                            </li>
                          </AccordionItem>
                        );
                      }))}
                    </Accordion>
                  </ul>);
                })
                }
              </div>
            </div>
            <Footer {...this.props}/>
          </div>)
        : null
    );
  }
}

const mapStateToProps = state => {
  return {
    showHeader: state.webSettingsReducer.showHeader
  };
};
const mapDispatchProps = dispatch => {
  return {
    setHeaderHide: data => {
      dispatch(hideHeader(data));
    }
  };
};


export default withRouter(connect(
  mapStateToProps,
  mapDispatchProps
)(CategoryTable));
