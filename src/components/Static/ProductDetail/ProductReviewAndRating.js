import React, {PureComponent} from "react";
import {ApiHelper} from "../../../helpers/ApiHelper";
import {InfiniteLoader} from "../Common/Loader/Loader";
import RatingList from "./RatingList";
import AddRating from "./AddRating";
import {ToastStore} from "react-toasts";
import InfiniteScroll from "react-infinite-scroll-component";

class ProductReviewAndRating extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            reviews: [],
            isLoggedIn: false,
            skip: 0,
            limit: 10,
            hasMore: true,
            disabledAddButton: false,
        };
    }

    componentWillMount() {
        const storageSession = JSON.parse(localStorage.getItem("localStorageVal"));
        if (storageSession) {
            this.setState({
                isLoggedIn: true
            });
        }
        this.getRatings();
    }

    addRating = async (rating, review) => {

        const {productId} = this.props;
        this.setState({disabledAddButton: true});
        const result = await new ApiHelper().FetchFromServer(
            "/",
            "rating",
            "POST",
            true,
            undefined,
            {
                productId,
                rating,
                review
            }
        );
        if (result.isError) {
            if (result.code === 401) {
                ToastStore.error("You need to login to add review.");
                return;
            }
            setTimeout(
                function () {
                    this.setState({disabledAddButton: false});
                }
                    .bind(this),
                3000
            );

            ToastStore.error(result.messages[0]);
            return;
        }
        ToastStore.success("Thank you for your review");
        this.setState({
            disabledAddButton: false,
            skip: 0,
            limit: 10
        });
        this.props.onRattingAdd();
        this.getRatings();
    };
    getRatings = async () => {
        const {productId} = this.props;
        this.setState({isLoading: this.state.skip === 0 ? true : false});
        let api = new ApiHelper();
        let result = await api.FetchFromServer("/", "rating", "GET", true, {
            productId: productId, limit: this.state.limit, skip: this.state.skip
        });
        if (result.isError) {
            this.setState({isLoading: false, reviews: []});
            return;
        }
        if (result.data.data.length === 0) {
            this.setState({
                hasMore: false
            });
        }

        let reviewData = result.data.data;
        if (this.state.skip !== 0) {
            reviewData = this.state.reviews.concat(result.data.data);
        }


        this.setState({
            isLoading: false,
            reviews: reviewData
        });
    };
    onLoadMore = () => {
        this.setState({
            skip: this.state.skip + this.state.limit
        }, () => this.getRatings())
    };

    render() {
        const {
            productName,
            averagRating,
            totalRatings,
            catalog,
            productSlug,
            openLoginPopup,
            isLoggedIn,
        } = this.props;
        const {reviews, isLoading } = this.state;
        return (
            <div className="user-review-wrap">
                <div className="user-review-head">
                    <h2 className="heading">{productName}</h2>
                    <div className="model-overall-rating inline-block">
            <span className="rate-count">
              <span className="star-icon">
                <i className="fa fa-star" aria-hidden="true"/>
              </span>
              <span className="font18 text-bold">{averagRating || 0}</span>
            </span>
                        <span className="text-xt-light rating-numbers">
              ({averagRating || 0} ratings)
            </span>
                        <span className="text-xt-light review-left-divider">
              {totalRatings}{" "}
                            {parseInt(totalRatings) === 1 ? "review" : "reviews"}
            </span>
                    </div>
                </div>
                <div className="review-list-wrapper">
                    <ul id="scrollableDiv" className="user-review-list">
                        {isLoading ? (
                            <InfiniteLoader/>
                        ) : reviews.length ? (
                            <InfiniteScroll
                                dataLength={reviews.length} //This is important field to render the next data
                                next={this.onLoadMore}
                                hasMore={this.state.hasMore}
                                loader={< InfiniteLoader/>}
                            >
                                {
                                    reviews.map((review, index) => {
                                        return <RatingList
                                            key={index}
                                            review={review}
                                            indexValue={index}
                                        />;
                                    })
                                }
                            </InfiniteScroll>
                        ) : (
                            null
                        )
                        }
                    </ul>
                </div>

                {isLoggedIn ? (
                    <AddRating
                        productName={productName}
                        averageRating={5}
                        onReviewAdd={this.addRating}
                        disabledAddButton={this.state.disabledAddButton}
                    />
                ) : (
                    <p>
                        You need to login to add review{" "}
                        <a
                            className="login-reivew-condition"
                            onClick={openLoginPopup}
                        >
                            Login Here
                        </a>
                    </p>
                )}
            </div>
        );
    }
}

export default ProductReviewAndRating;
