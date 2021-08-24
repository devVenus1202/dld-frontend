import React, {Component} from "react";
import qs from "query-string";
import {connect} from "react-redux";
import {redirectTo, giftCardListRequest} from "../../actions";
import {AppConfig} from "../../config/AppConfig";
import GiftCardList from "../../components/Static/GiftCard/GiftCardList";
import GiftCardGrid from "../../components/Static/GiftCard/GiftCardGrid";
import {
  InfiniteLoader
} from "../../components/Static/Common/Loader/Loader";
import InfiniteScroll from "react-infinite-scroll-component";

class GiftCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skip: 0,
      limit: AppConfig.PRODUCTS_PER_PAGE,
      modeList: true,
      showCategoryToggle: false,
      query: {
        sortBy: 3
      }
    };
  }

  onViewChange = e => {
    this.setState({
      modeList: e
    });
  };

  onSortByChange = sortBy => {
    this.setState(
      {
        query: {
          sortBy: sortBy
        },
        skip: 0,
        limit: AppConfig.PRODUCTS_PER_PAGE
      });
    const {redirect, location} = this.props;
    const path =
      location.pathname +
      "?" +
      qs.stringify({...this.state.query, sortBy: sortBy});
    redirect(path);
  };

  toggleCategoryMenu = () => {
    this.setState({showCategoryToggle: !this.state.showCategoryToggle});
  };

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    const prevPath = prevProps.location.search;
    const currentPath = this.props.location.search;
    if (prevPath !== currentPath) {
      this.getData();
    }
  }

  getData = () => {
    const {location} = this.props;
    const {search} = location;
    const searchString = qs.parse(search);
    this.setState({
      query: {
        ...searchString
      }
    });
    let dataPagination = {
      limit: this.state.limit,
      skip: 0,
      ...searchString
    };
    this.props.giftCardListAction(dataPagination);
  };

  loadMoreData = () => {
    const {giftCardListAction} = this.props;
    const {skip, limit} = this.state;
    this.setState(
      {
        skip: skip + limit
      },
      () => {
        let dataPagination = {
          limit: this.state.limit,
          skip: this.state.skip,
          sortBy: this.state.query.sortBy
        };
        giftCardListAction(dataPagination);
      }
    );
  };

  render() {
    const {productListData} = this.props;
    const {
      isMoreData,
      productList,
    } = productListData;
    return (
      <section className="shop-page margin50">
        <div className="row">
          <div className="gifts-cards-container container clearfix">
            <div className="minHight main-content col-lg-9 col-md-8 col-sm-12 col-xs-12 has-sidebar">
              <h1 className="shop-title">
                Gift Cards
              </h1>
              {this.state.modeList ? (
                  <div className={"text-center paginationCatalog"}>
                    <InfiniteScroll
                      dataLength={productList.length}
                      next={this.loadMoreData}
                      hasMore={isMoreData}
                      loader={<InfiniteLoader/>}
                    >
                      <GiftCardList
                        productListData={productListData}
                        onViewChange={this.onViewChange}
                      />
                    </InfiniteScroll>
                  </div>)
                :
                (
                  <div className={"text-center paginationCatalog"}>
                    <InfiniteScroll
                      dataLength={productList.length}
                      next={this.loadMoreData}
                      hasMore={isMoreData}
                      loader={<InfiniteLoader/>}
                    >
                      <GiftCardGrid
                        productListData={productListData}
                        onViewChange={this.onViewChange}/>
                    </InfiniteScroll>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </section>
    );

  }
}


const mapStateToProps = state => {
  return {
    productListData: state.giftCardListReducer
  };
};


const mapDispatchProps = dispatch => {
  return {
    redirect: path => {
      dispatch(
        redirectTo({
          path: path
        })
      );
    },
    giftCardListAction: (dataPagination) => {
      dispatch(giftCardListRequest(dataPagination));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchProps
)(GiftCard);
