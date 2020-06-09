import React, { PureComponent } from "react";
import * as moment from "moment";
import _ from "lodash";

class RatingList extends PureComponent {
  render() {
    const { review } = this.props;
   
    return (
      <li className="list-item">
        <div className="review-list-head">
          <span className="rating-badge">
            <span className="start-icon">
              <i className="fa fa-star" aria-hidden="true" />
            </span>
            &nbsp;<span className="star-count">{review.rating}</span>
          </span>
          <span className="user-name inline-block">
            {review.user
              ? [review.user.firstName, review.user.lastName].join(" ")
              : "Site User"}
          </span>
          <span className="date-time inline-block">
            {moment(review.createdAt).fromNow()}
          </span>
        </div>
        <div className="review-content-wrap">
          <div className="main-content">
            <p>{_.unescape(review.review)}</p>
          </div>
        </div>
      </li>
    );
  }
}

export default RatingList;
