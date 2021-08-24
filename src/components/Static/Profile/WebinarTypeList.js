import React, {PureComponent} from "react";
import _ from 'lodash';
import classNames from 'classnames';
import {ApiHelper} from "../../../helpers/ApiHelper";
import {Pager, Panel, Table} from "react-bootstrap";
import {InfiniteLoader} from "../Common/Loader/Loader";
import WebinarOrderDetails from "./WebinarOrderDetails";
import {
    WEBINAR_STATE_COMPLETED,
    WEBINAR_STATE_ONGOING,
    WEBINAR_STATE_UPCOMING,
} from "../../../constants";
import Constant from "../../../config/Constant";

class WebinarTypeList extends PureComponent {
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
        this.getProducts().catch((e)=>(console.log(e)));
    }

    getProducts = async () => {
        const {webinarState} = this.props;

        this.setState({
            isLoading: true
        });
        const result = await new ApiHelper().FetchFromServer(
            "/order",
            "/webinarList",
            "GET",
            true,
            {
                webinarState
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
        const {title} = this.props
        const {
            isLoading,
            products,
            detailsTitle,
            isOpen,
            webinarDetails,
            allProducts,
            webinarAllDetails,
        } = this.state;

        return (
            <Panel bsStyle="primary">
                <Panel.Heading>
                    <Panel.Title componentClass="h3">
                        {title}
                        <span
                            className={"pull-right"}
                            style={{cursor: "pointer"}}
                            onClick={this.getProducts}
                        >
                            <img alt="view"src={Constant.frontUrl+"/assets/img/icons/ico-update.svg"} width="16px"/>
                        </span>
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Body style={{ overflow: 'auto' }}>
                    {isLoading ? (
                        <InfiniteLoader/>
                    ) : (
                        <Table striped bordered condensed hover>
                            <thead>
                            <tr>
                                <th>Webinar</th>
                                <th>Status</th>
                                <th>Category</th>
                                <th width={140}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.length ? (
                                products.map((item, index) => {
                                    const webinarState = _.get(item, 'orderdetails[0].product.webinarState');
                                    let webinarStateString = '';

                                    switch (webinarState) {
                                        case WEBINAR_STATE_ONGOING:
                                            webinarStateString = 'Ongoing';
                                            break;

                                        case WEBINAR_STATE_COMPLETED:
                                            webinarStateString = 'Completed';
                                            break;

                                        case WEBINAR_STATE_UPCOMING:
                                        default:
                                            webinarStateString = 'Upcoming';
                                            break;
                                    }

                                    return item ? (
                                        <tr
                                            key={index}
                                        >
                                            <td>{item.orderdetails[0].product.productName}</td>
                                            <td>
                                                <span
                                                    className={
                                                        classNames(
                                                            { 'color-green': webinarState === WEBINAR_STATE_ONGOING },
                                                            { 'color-orange': webinarState === WEBINAR_STATE_UPCOMING },
                                                            { 'color-grey': webinarState === WEBINAR_STATE_COMPLETED },
                                                        )
                                                    }
                                                >{webinarStateString}</span>
                                            </td>
                                            <td>{item.orderdetails[0].product.category && item.orderdetails[0].product.category.categoryName || ''}</td>
                                            <td>
                                                <div className="webinar-actions">

                                                    {item.orderdetails[0].product.webinarUrl && item.orderStatus !== "refund" && (
                                                        <p>
                                                            <a href={item.orderdetails[0].product.webinarUrl} target="_blank">
                                                                <img alt="view"src={Constant.frontUrl+"/assets/img/icons/link-icon.svg"} width="20px"/>
                                                                View link</a>
                                                        </p>
                                                    )}
                                                    {item.orderStatus === "refund" ?
                                                        <p><span className="refunded-badge">{"Refunded"}</span></p>
                                                        : null}
                                                    <button
                                                        className="webinar-view-icon"
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
                                                        <img alt="view"src={Constant.frontUrl+"/assets/img/icons/view-icon.svg"} width="20px"/>
                                                    </button>
                                                </div>
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
                               Previous
                            </Pager.Item>
                            {this.state.offset + 1}-{this.state.limit + this.state.offset > this.state.allProducts.length ? this.state.allProducts.length : this.state.limit + this.state.offset} of {allProducts.length}
                            <Pager.Item
                                disabled={
                                    this.state.offset >= 0 &&
                                    this.state.allProducts.length <
                                    this.state.limit + this.state.offset
                                }
                                next
                                onSelect={this.nextPage}
                            >
                                Next
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
                    orderDetailsData={webinarAllDetails}
                    currentItem={this.state.currentItem}
                    type={"webinar"}
                />
            </Panel>
        );
    }
}

export default WebinarTypeList;
