import React, {PureComponent} from "react";
import {ApiHelper} from "../../../helpers/ApiHelper";
import {Badge, Pager, Panel, Table} from "react-bootstrap";
import {InfiniteLoader} from "../Common/Loader/Loader";
import * as moment from "moment";
import WebinarOrderDetails from "./WebinarOrderDetails";

class WebinarOrders extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            allProducts: [],
            isLoading: true,
            offset: 0,
            limit: 5,
            webinarAllDetails: [],
            currentItem: []
        };
    }
    
    componentWillMount() {
        this.getProducts();
    }
    
    getProducts = async () => {
        this.setState({
            isLoading: true
        });
        const result = await new ApiHelper().FetchFromServer(
            "/order",
            "/orderList",
            "GET",
            true,
            {
                status: "digital"
            }
        );
        if (result.isError) {
            this.setState({isLoading: false, products: [], allProducts: []});
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
            webinarDetails,
            allProducts,
            webinarAllDetails
        } = this.state;
        return (
            <Panel bsStyle="primary">
                <Panel.Heading>
                    <Panel.Title componentClass="h3">
                        Webinars{" "}
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
                                <th>View Details</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.length ? (
                                products.map((item, index) => {
                                    return item ? (
                                        <tr key={index}>
                                            <td>{item.customOrderId}</td>
                                            <td>{moment(item.createdAt).format("LLL")}</td>
                                            <td>
                                                <button
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        let webinarDetails = [];
                                                        try {
                                                            webinarDetails = JSON.parse(
                                                                item.orderdetails[0].webinarDetails
                                                            )
                                                        } catch (error) {
                                                            console.log(error);
                                                        }
                                                        this.setState({
                                                            isOpen: true,
                                                            detailsTitle: item.orderdetails[0] ? item.orderdetails[0].product.productName : '----',
                                                            webinarDetails: webinarDetails,
                                                            webinarAllDetails: item,
                                                            currentItem: item
                                                        });
                                                    }}
                                                >
                                                    <i className={"fa fa-eye color-black"}/>
                                                </button>&nbsp;
                                                {item.orderStatus === "refund" ?
                                                    <Badge pill variant="primary">{"Refunded"}</Badge>
                                                    : null}
                                            </td>
                                        </tr>
                                    ) : null;
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
                <WebinarOrderDetails
                    isOpen={isOpen}
                    isLoading={false}
                    title={detailsTitle}
                    onHide={() => {
                        this.setState({isOpen: false});
                    }}
                    webinarDetails={webinarDetails}
                    webinarNotes={webinarDetails}
                    orderDetailsData={webinarAllDetails}
                    currentItem={this.state.currentItem}
                    type={"webinar"}
                />
            </Panel>
        );
    }
}

export default WebinarOrders;