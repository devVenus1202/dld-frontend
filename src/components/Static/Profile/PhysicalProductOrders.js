import React, {PureComponent} from "react";
import {ApiHelper} from "../../../helpers/ApiHelper";
import {Panel, Table, Pager, Badge} from "react-bootstrap";
import {InfiniteLoader} from "../Common/Loader/Loader";
import * as moment from "moment";
import ProductOrderDetails from "./ProductOrderDetails";
import {withRouter} from "react-router";
import { updateToken } from "../../../helpers/user";

class PhysicalProductOrders extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {products: [], isLoading: true, offset: 0, limit: 5, currentItem: []};
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
        updateToken({token: result.data.token});
        this.getProducts();
    }

    getProducts = async () => {
        this.setState({isLoading: true});
        const result = await new ApiHelper().FetchFromServer(
            "/order",
            "/orderList",
            "GET",
            true,
            {
                status: "physical"
            }
        );

        if (result.isError) {
            this.setState({
                isLoading: false,
                products: []
            });
            return;
        }
        const {data} = result.data;
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
    };
    prevPage = () => {
        const {offset, limit, allProducts} = this.state;
        this.setState({isLoading: true});
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
        const {offset, limit, allProducts} = this.state;
        this.setState({isLoading: true});
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

    render() {
        const {
            isLoading,
            products,
            detailsTitle,
            isOpen,
            orderDetails,
            total,
            grossAmount,
            discount,
            allProducts,
            shippingCharge,
            giftcardorderdetails
        } = this.state;
        return (
            <Panel bsStyle="primary">
                <Panel.Heading>
                    <Panel.Title componentClass="h3">
                        Products
                        <span
                            className={"pull-right"}
                            style={{cursor: "pointer"}}
                            onClick={this.getProducts}
                        >
              <i className={"fa fa-refresh"}/>
            </span>
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    {isLoading ? (
                        <InfiniteLoader/>
                    ) : (
                        <Table striped bordered condensed hover>
                            <thead>
                            <tr>
                                <th>Order Number</th>
                                <th>Order Date</th>
                                <th>Shipping Status</th>
                                <th>View Details</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.length ? (
                                products.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.customOrderId}</td>
                                            <td>{moment(item.createdAt).format("LLL")}</td>
                                            <td>
                                                {console.log('Hello')}
                                                {item.orderdetails && item.orderdetails.map(detail => {
                                                    console.log(detail);
                                                    return <div>
                                                        {detail.trackingNumbers && detail.trackingNumbers[0] ? detail.trackingNumbers[0].shippingStatus : 'Pending'}
                                                        <br/>
                                                        <span>Tracking Number: <b>{detail.trackingNumbers && detail.trackingNumbers[0] ? detail.trackingNumbers[0].shippingNumber : ''}</b></span>
                                                    </div>
                                                })}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        this.setState({
                                                            isOpen: true,
                                                            detailsTitle: item.customOrderId,
                                                            orderDetails: item.orderdetails,
                                                            giftcardorderdetails: item.giftcardorderdetails,
                                                            grossAmount: item.grossAmount || 0,
                                                            total: item.totalAmount || 0,
                                                            discount: item.coupanDiscount || 0,
                                                            shippingCharge: item.shippingCharge,
                                                            currentItem: item
                                                        });
                                                    }}
                                                >
                                                    <i className={"fa fa-eye color-black"}/>
                                                </button>
                                                &nbsp;
                                                {item.orderStatus === "refund" ?
                                                    <Badge pill variant="primary">{"Refunded"}</Badge>
                                                    : null}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={4} className={"text-center"}>
                                        No Orders available
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
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
                <ProductOrderDetails
                    isOpen={isOpen}
                    isLoading={false}
                    title={detailsTitle}
                    onHide={() => {
                        this.setState({isOpen: false});
                    }}
                    orderDetails={orderDetails}
                    giftcardorderdetails={giftcardorderdetails}
                    total={total}
                    grossAmount={grossAmount}
                    discount={discount}
                    shippingCharge={shippingCharge}
                    currentItem={this.state.currentItem}
                />
            </Panel>
        );
    }
}

export default withRouter(PhysicalProductOrders);
