import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { Loader } from "../../Common/Loader/Loader";
import * as moment from "moment";
class CommonGiftLogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        const { giftcardlogsData } = this.props;
        return (
            giftcardlogsData.length > 0 ?
            <Table striped bordered condensed hover class>
                <thead>
                    <tr>
                        <th>Order Number/Shared With</th>
                        <th>Order/Share</th>
                        <th>Amount Used($)</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.isLoading ?
                            <Loader /> :
                            giftcardlogsData.length ?
                            giftcardlogsData.map((item,index)=> {
                                return <tr>
                                        <td>{item.status === "ordered" ?
                                        "Order Id - "+ item.orderId: "Shared With - "+item.email}</td>
                                        <td className="textcapitalize">{item.status}</td>
                                        <td>{item.status === "ordered" ? 
                                            item.giftCardAmountUsed
                                            : "-"}</td>
                                        <td>{moment(item.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                    </tr>
                            })     
                            : 
                            <tr className="text-center">
                                <td colSpan="3">---</td>
                            </tr>                      
                    }
                </tbody>

            </Table> :
            null

        );
    }
}

export default CommonGiftLogs;
