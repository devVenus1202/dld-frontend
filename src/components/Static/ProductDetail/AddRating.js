import React, { PureComponent } from "react";
import StarRatingComponent from "react-star-rating-component";

class AddRating extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rating: this.props.averageRating,
      review: "",
      starError: false
    };
  }
  onStarClick = star => {
    this.setState({ rating: star, starError: false });
  };
  onAdd = e => {
    e.preventDefault();
    const { review, rating } = this.state;
    if (!rating) {
      this.setState({
        starError: true
      });
      setTimeout(() => {
        this.setState({
          starError: false
        });
      }, 5000);
      return;
    }
    const { onReviewAdd } = this.props;
    onReviewAdd(rating, review);
    setTimeout(
      function () {
        this.setState({review: ""});
      }.bind(this),1000
    );
  };

  render() {
    const { productName } = this.props;
    const { review, rating, starError } = this.state;
    return (
      <div className="rating-box-wrap">
        <div className="content-box-shadow rating-box-inner clearfix">
          <div className="left-section">
            <div className="star-circle inline-block">
              <span className="single-star">
                <i className="fa fa-star" aria-hidden="true" />
              </span>
            </div>
            <div className="inline-block text-bold heading">
              Rate your Product
            </div>
            <div className="inline-block text-xt-light">
              Share your experience about <b>{productName}</b>
            </div>
          </div>
          <div className="right-section">
            <div className="apply-rating">
              <StarRatingComponent
                name="rate"
                starCount={5}
                editing={true}
                value={rating}
                onStarClick={this.onStarClick}
              />
            </div>
            {starError ? (
              <p className={"errorCart"}>*Please select rating.</p>
            ) : null}
          </div>
        </div>
        <div className="content-box-shadow padding20 rating-comment-section">
          <div className="rating-comment-inner">
            <form id="" method="POST" onSubmit={this.onAdd}>
              <div className="form-group">
                <textarea
                  name="address"
                  placeholder="Enter your review here..."
                  rows="8"
                  className="form-control"
                  id=""
                  value={review}
                  maxLength="255"
                  onChange={e => {
                    this.setState({ review: e.target.value });
                  }}
                />
                <div className="footer-character-msg">Only 255 characters are allowed.</div>
              </div>
              {
                this.props.disabledAddButton ?
                <button disabled className="btn-effect one comment-btn">Submit</button>
                :
                <button className="btn-effect one comment-btn">Submit</button>
              }
              
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AddRating;
