import React, {Component} from "react";
import {buildProductLink} from "../../../helpers/links";
import ShopPageListItem from "./components/ShopPage/ListItem";


class ShopPage extends Component {
  onGoToDetails = (item) => () => {
    const {onLastFiltersSave} = this.props;
    const {
      history,
      saveScrollTop,
      scrollView
    } = this.props;
    saveScrollTop();
    onLastFiltersSave(item.status)
    if (this.props.scrollView)
      window.localStorage.setItem("lastScrollPosition", this.props.scrollView.scrollTop);
    history.push(buildProductLink(item));
  };

  render() {
    const {productListData} = this.props;
    return (
      <div id="" className="a-row list-group list-products-wrap">
        {productListData.productList
          ? productListData.productList.map((item, index) => {
            return <ShopPageListItem key={index} keyIndex={index} onClick={this.onGoToDetails(item)} item={item}/>;
          })
          : null}
      </div>
    );
  }
}

export default ShopPage;
