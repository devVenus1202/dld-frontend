import React, {Component} from "react";
import {
  redirectTo,
} from "../../actions";
import {connect} from "react-redux";
import qs from "query-string";
import {
  PRODUCT_DIGITAL,
  PRODUCT_LIST_MAX_PRICE,
  PRODUCT_LIST_MIN_PRICE,
  PRODUCT_LIST_SORT_BY_NEWEST,
} from "../../constants";
import {getProductsLink} from "../../helpers/links";

export const baseFilters = {
  sort: PRODUCT_LIST_SORT_BY_NEWEST,
  min_price: PRODUCT_LIST_MIN_PRICE,
  max_price: PRODUCT_LIST_MAX_PRICE,
  categories: [],
  filters: []
};

class Catalog extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {location, redirect} = this.props
    const filters = qs.parse(location.search, {
      arrayFormat: 'comma',
    });

    return redirect(getProductsLink(filters.status))
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => {
  return {};
};
const mapDispatchProps = dispatch => {
  return {
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
)(Catalog);
