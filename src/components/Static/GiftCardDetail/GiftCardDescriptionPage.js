import React, {Component} from 'react';
import {Tab, Tabs} from "react-bootstrap";


class GiftCardDescriptionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
        };
    }
    
    handleSelect = (key) => {
        this.setState({key});
    }
    
    render() {
        const {giftCardDetails} = this.props;
        const {giftProductData} = giftCardDetails;
        if (giftProductData.description) {
            return (
                <div className="tabs-details-wrap">
                    <div className="row">
                        
                        <div className="col-sm-12">
                            <Tabs
                                activeKey={this.state.key}
                                onSelect={this.handleSelect}
                                id="controlled-tab-example"
                                className="custom-tab-wrap"
                            >
                                <Tab eventKey={1} title="Description" tabClassName="">
                                    <p dangerouslySetInnerHTML={{__html: giftProductData.description}}></p>
                                </Tab>
                            
                            </Tabs>
                        </div>
                    </div>
                </div>
            
            )
        } else
            return null
        
    }
}


export default GiftCardDescriptionPage;
