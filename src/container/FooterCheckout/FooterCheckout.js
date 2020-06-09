import React,{Component} from 'react';
import { Link } from "react-router-dom";
class FooterCheckout extends Component {
  constructor(props){
    super(props);
    this.state={
    }
  }

  render() {
    return (
        <div className="footer-page">
           <footer className="theme-footer">
             <div className="theme-container">
                <div className="footer-bottom">
                   <div className="design-by text-center">
                      {/* <span>2018 © dldvip All Rights Reserved.</span>&nbsp;|&nbsp;
                      <span>Designed &amp; Developed By <a href="http://www.chapter247.com/" ><img src={Constant.frontUrl+"/assets/img/chapter_logo.png" } alt=""/></a></span> */}
                      <span><Link to={"/faq"} className="widget-link"> FAQ</Link></span>
                       <span><Link to={"/privacy-policy"} className="widget-link"> Terms and Conditions</Link></span>
                       <span><Link to={"/terms-and-condition"} className="widget-link"> Terms and Conditions</Link></span>
                   </div>
                </div>
             </div>
          </footer>
        </div>
    );
  }
}

export default FooterCheckout;