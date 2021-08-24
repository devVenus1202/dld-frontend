import React, { Component } from "react";
import Constant from "../../../config/Constant";

class SmallCommentBlock extends Component {
    render() {
        return (
            <div className="comment-scroll-container">
                <div className="add-comment">
                    <img
                        src={
                            Constant.frontUrl + "/assets/img/icons/ico-user.svg"
                        }
                        alt=""
                    />
                     <textarea
                         className="form-comment"
                         rows="2"
                         id="unique_comment"
                         placeholder="Your comment"/>
                    <button className="comment-btn"><span/></button>
                </div>
                <ul className="comment-list">
                    <li>
                        <div className="user-img">
                            <img
                                src={
                                    Constant.frontUrl + "/assets/img/icons/ico-user.svg"
                                }
                                alt=""/>
                        </div>
                        <div className="comment">
                            <h3>User Name</h3>
                            Your comment
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}

export default SmallCommentBlock;
