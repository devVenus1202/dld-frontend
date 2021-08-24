import React, { PureComponent } from "react";
import { ApiHelper } from "../../../../helpers/ApiHelper";
import { Panel, Table, Pager } from "react-bootstrap";
import { InfiniteLoader } from "../../Common/Loader/Loader";
import { withRouter } from "react-router";
import * as moment from "moment";
import { updateToken } from "../../../../helpers/user";
class GiftOrderTrackPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      isLoading: true,
      offset: 0,
      limit: 5,
      currentItem: [],
      displayShare: false,
      sendDataId: [],
      displayDetailBox: false,
      detailsTitle: "",
    };
  }

  async componentWillMount() {
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "user/profile",
      "GET",
      true,
      undefined
    );
    console.log(result);
    if (result.isError) {
      const {
        history
      } = this.props;
      localStorage.removeItem("localStorageVal");
      history.push("/login");
    }
    console.log(result);
    updateToken({token: result.data.token});
    this.getProducts();
  }

  getProducts = async () => {
    this.setState({ isLoading: true });
    const result = await new ApiHelper().FetchFromServer(
      "/giftcard",
      "/getMyGiftCart",
      "GET",
      true,
    );
    if (result.isError) {
      this.setState({
        isLoading: false,
        products: []
      });
      return;
    }
    const { data } = result.data;
    const prod = [];
    for (let i = 0; i < this.state.limit; i++) {
      const product = data[i];
      if (product && i < this.state.limit) {
        prod.push(product);
      }
    }
    this.setState({
      allProducts: data,
      products: prod,
      isLoading: false
    });
  }

  prevPage = () => {
    const { offset, limit, allProducts } = this.state;
    this.setState({ isLoading: true });
    const prod = [];
    for (let i = offset - limit; i < offset; i++) {
      const product = allProducts[i];
      if (product) {
        prod.push(product);
      }
    }
    this.setState({
      offset: offset - limit,
      products: prod,
      isLoading: false
    });
  };
  nextPage = () => {
    const { offset, limit, allProducts } = this.state;
    this.setState({ isLoading: true });
    const prod = [];
    for (let i = offset + limit; i < offset + limit * 2; i++) {
      const product = allProducts[i];
      if (product) {
        prod.push(product);
      }
    }
    this.setState({
      offset: offset + limit,
      products: prod,
      isLoading: false
    });
  };

  toggleShareShowHide = () => {
    this.setState({
      displayShare: !this.state.displayShare
    })
  }

  render() {
    const {
      isLoading,
      products,
      // detailsTitle,
      // orderDetails,
      // total,
      // grossAmount,
      allProducts,
    } = this.state;
    //console.log(products);
    return (
      <Panel bsStyle="primary" >
        <Panel.Heading>
          <Panel.Title componentClass="hisOpen3">
            Gift Cards
            <span
              className={"pull-right"}
              style={{ cursor: "pointer" }}
              onClick={this.getProducts}
            >
              <i className={"fa fa-refresh"} />
            </span>
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          {isLoading ? (
            <InfiniteLoader />
          ) : (
              <div>
                  <Table striped bordered condensed hover className={'normalListCode'}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Code</th>
                    <th>Issue date</th>
                    <th>Last use date</th>
                    <th>Initial balance</th>
                    <th>Current balance</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length ? (
                    products.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{(item.giftcard) ? item.giftcard.title: '-'}</td>
                          <td>{item.giftCardCode}</td>
                          <td>{moment(item.createdAt).format("LL")}</td>
                          <td>{moment(item.updatedAt).format("LL")}</td>
                          <td>{item.currentPrice}</td>
                          <td>{item.remainingPrice}</td>
                        </tr>
                      );
                    })
                  ) : (
                      <tr>
                        {/*<td colSpan={4} className={"text-center"}>*/}
                          No Orders available
                        {/*</td>*/}
                      </tr>
                    )}
                </tbody>
              </Table>
              
              <Table striped bordered condensed hover className={'tabletListCode'}>
                  <thead>
                      <tr>
                          <th>Info</th>
                          <th>Initial balance</th>
                          <th>Current balance</th>
                      </tr>
                  </thead>
                  <tbody>
                  {products.length ? (
                      products.map((item, index) => {
                          return (
                              <tr key={index}>
                                  <td>
                                      <p><b>Title: </b>{(item.giftcard) ? item.giftcard.title: '-'}</p>
                                      <p><b>Code:</b> {item.giftCardCode}</p>
                                      <p><b>Issue date:</b> {moment(item.createdAt).format("LL")}</p>
                                      <p><b>Last use date:</b> {moment(item.updatedAt).format("LL")}</p>
                                  </td>
                                  <td>{item.currentPrice}</td>
                                  <td>{item.remainingPrice}</td>
                              </tr>
                          );
                      })
                  ) : (
                      <tr>
                          {/*<td colSpan={4} className={"text-center"}>*/}
                          No Orders available
                          {/*</td>*/}
                      </tr>
                  )}
                  </tbody>
                  </Table>
                  </div>
            )}
          {isLoading || !allProducts.length ? null : (
            <Pager>
              <Pager.Item
                disabled={this.state.offset === 0}
                previous
                href="#"
                onSelect={this.prevPage}
              >
                &larr; Previous
              </Pager.Item>
              <Pager.Item
                disabled={
                  this.state.offset > 0 &&
                  this.state.allProducts.length <
                  this.state.limit + this.state.offset
                }
                next
                onSelect={this.nextPage}
              >
                Next &rarr;
              </Pager.Item>
            </Pager>
          )}
        </Panel.Body>
      </Panel>
    );
  }
}

export default withRouter(GiftOrderTrackPage);
