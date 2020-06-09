import React, { Component } from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import { ApiHelper } from '../../../helpers/ApiHelper';
import { Loader } from "../../Static/Common/Loader/Loader";
class FaqPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            faqData: [],
            isLoading: false
        }
    }


    async componentDidMount() {
        window.scrollTo(0,0);
        let api = new ApiHelper();
        this.setState({isLoading: true});
        let result = await api.FetchFromServer('/', 'faq', 'GET', false, undefined, undefined);
        if (!result.isError) {
            this.setState({isLoading: false});
            this.setState({faqData: result.data.data});
        }
        this.setState({isLoading: false});
    }
  render() {
    return (
		<section className="faq-page margin50">
			<div className="row">
                <div className="col-sm-12">
                    <div className="page-head">
                        <h1>
                            <span>FAQs</span>
                        </h1>
                    </div>
                    {
                        this.state.isLoading ? <Loader /> : null
                    }
                    <div className="faq-wrap">
                        <Accordion>
                            {
                                this.state.faqData && this.state.faqData.length ?
                                this.state.faqData.map((item, index) => {
                                    return <AccordionItem key={index}>
                                            <AccordionItemTitle>
                                            <h3 className="u-position-relative">
                                                {item.questions}
                                                <div className="accordion__arrow" role="presentation"/>
                                            </h3>
                                            </AccordionItemTitle>
                                            <AccordionItemBody>
                                                    <p dangerouslySetInnerHTML={{ __html: item.answers }}></p>
                                            </AccordionItemBody>
                                        </AccordionItem>
                                    })
                             : <span>.....</span> }
                            {/* // <AccordionItem>
                            //     <AccordionItemTitle>
                            //     <h3 className="u-position-relative">
                            //         What is Lorem Ipsum?
                            //         <div className="accordion__arrow" role="presentation"/>
                            //     </h3>
                            //     </AccordionItemTitle>
                            //     <AccordionItemBody>
                            //         <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                            //     </AccordionItemBody>
                            // </AccordionItem>
                            // <AccordionItem>
                            //     <AccordionItemTitle>
                            //     <h3 className="u-position-relative">
                            //         Why do we use it?
                            //         <div className="accordion__arrow" role="presentation"/>
                            //     </h3>
                            //     </AccordionItemTitle>
                            //     <AccordionItemBody>
                            //         <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                            //     </AccordionItemBody>
                            // </AccordionItem>
                            // <AccordionItem>
                            //     <AccordionItemTitle>
                            //     <h3 className="u-position-relative">
                            //     The standard Lorem Ipsum passage, used since the 1500s
                            //     <div className="accordion__arrow" role="presentation"/>
                            //     </h3>
                            //     </AccordionItemTitle>
                            //     <AccordionItemBody>
                            //         <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                            //     </AccordionItemBody>
                            // </AccordionItem>
                            // <AccordionItem>
                            //     <AccordionItemTitle>
                            //     <h3 className="u-position-relative">
                            //         Where does it come from?
                            //         <div className="accordion__arrow" role="presentation"/>
                            //     </h3>
                            //     </AccordionItemTitle>
                            //     <AccordionItemBody>
                            //         <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.</p>
                            //     </AccordionItemBody>
                            // </AccordionItem>
                            // <AccordionItem>
                            //     <AccordionItemTitle>
                            //     <h3 className="u-position-relative">
                            //         Where can I get some?
                            //         <div className="accordion__arrow" role="presentation"/>
                            //     </h3>
                            //     </AccordionItemTitle>
                            //     <AccordionItemBody>
                            //         <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, </p>
                            //     </AccordionItemBody>
                            // </AccordionItem> */}
                        </Accordion>
                    </div>
                </div>
			</div>
		</section>
    )
  }
}

export default FaqPage;
