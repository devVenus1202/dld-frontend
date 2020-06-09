import React from 'react';
import {Link} from "react-router-dom";
import {Carousel} from 'react-responsive-carousel';
import classNames from 'classnames';
import * as Style from "./HomeContent.css";
import SmallCommentBlock from "../SmallCommentBlock";
import {AppConfig} from "../../../config/AppConfig";


export default class HomeContent extends React.Component {
  renderProducts = (products) => {
    return products.map(item => {
      const showCommentsCount = item.status === 'digital';
      const countOfComments = showCommentsCount ? (item.commentsCount && item.commentsCount.length) || 0 : '';
      const img = item.productImageThumbnail
        ? AppConfig.cdn + item.productImageThumbnail
        : item.productImage ? AppConfig.cdn + item.productImage : '/assets/img/img-dld-placeholder.jpg';

      return (
        <div className="item width-product-list width-product-home " key={item.id}>
          <div className="product-item img-shine-effect">
            <Link
              to={`/${item.status}/${item.productSlug}`}
              className="product-inner shine-effect-inner clearfix"
            >
              <div className="image-block hidden-img">
                <div className="list-image">
                  <img
                    alt=""
                    src={img}
                    onError={e => {
                      e.target.onError = null;
                      e.target.src = "/assets/img/img-dld-placeholder.jpg";
                    }}
                  />
                </div>
              </div>
              <div className="product-info">
                <h4 className="product-name product_title">{item.productName}</h4>
              </div>
              <div className="product-group-info">
                <div className="price">
                  <span className="Price-amount">
                    {
                      (parseFloat(item.strokedProductPrice))
                    ?
                      (<span>
                          <span className="currencySymbol">$</span>
                          <strike>{item.strokedProductPrice}</strike>
                      </span>)
                      : ''
                    }
                    <span>
                        <span className="currencySymbol">$</span>
                      {item.productPrice}
                    </span>
                  </span>
                </div>
                {
                  (item.status === "digital")
                    ? (
                      <div className="remaing-items">
                        <span><font>{item.remainingQuantity}</font> Views Remaining</span>
                      </div>
                    )
                    : ""
                }
                {
                  item.status === "digital" && (
                    <div className="comment-block">
                      <p className="comment-label">
                        <span className="icon"/>
                        {
                          countOfComments
                            ? (<span>{countOfComments} comments </span>)
                            : (<span>Leave a comment</span>)
                        }
                      </p>
                    </div>
                  )
                }
              </div>
            </Link>
            {
              item.status === "digital" && (
                <div className="comment-hover">
                  <div className="comment-relative">
                    <SmallCommentBlock/>
                    <div className="overlay"/>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      );
    });
  };

  renderPopularProducts = (popularProducts) => {

    const that = this;

    return (
      <div className={Style["products"]}>
        <div className={Style["products-header"]}>
          <h3>Popular Products</h3>
        </div>

        {Object.keys(popularProducts).map(function (key, index) {
          const groupByCategory = popularProducts[key];
          return (
            <div>
              {/*show on desktop version*/}
              <div className={Style["products-row-wrapper"]}>
                <h1>{groupByCategory.category.categoryName}</h1>
                <div className={Style["products-row"]}>
                  {that.renderProducts(groupByCategory.items)}
                </div>
                <button className={classNames(Style["button"], "btn-effect one")}
                        onClick={() => that.handleGoToPopularProducts(groupByCategory.category.id)}>All
                  in {groupByCategory.category.categoryName}</button>
              </div>

              {/*show on mobile version*/}
              <div className={Style["products-mobile"]}>
                <h1>{groupByCategory.category.categoryName}</h1>
                <div>
                  {that.renderMobilePopularProducts(groupByCategory.items)}
                </div>
                <button className={classNames(Style["button"], "btn-effect one")}
                        onClick={() => that.handleGoToPopularProducts(groupByCategory.category.id)}>All
                  in {groupByCategory.category.categoryName}</button>
              </div>
            </div>
          );


        })
        }
      </div>
    );
  };


  renderMobilePopularProducts = (list) => (
    <Carousel showArrows={false} showThumbs={false}>{this.renderProducts(list)}</Carousel>
  );

  renderPopularWebinars = (popularWebinars) => {

    const that = this;

    return (
      <div className={Style["products"]}>
        <div className={Style["products-header"]}>
          <h3>Popular Webinars</h3>
        </div>
        {Object.keys(popularWebinars).map(function (key, index) {
          const groupByCategory = popularWebinars[key];
          return (
            <div>
              {/*show on desktop version*/}
              <div className={Style["products-row-wrapper"]}>
                <h1>{groupByCategory.category.categoryName}</h1>
                <div className={Style["products-row"]}>
                  {that.renderProducts(groupByCategory.items)}
                </div>
                <button className={classNames(Style["button"], "btn-effect one")}
                        onClick={() => that.handleGoToPopularWebinars(groupByCategory.category.id)}>All
                  in {groupByCategory.category.categoryName}</button>
              </div>

              {/*show on mobile version*/}
              <div className={Style["products-mobile"]}>
                <h1>{groupByCategory.category.categoryName}</h1>
                <div>
                  {that.renderMobilePopularWebinars(groupByCategory.items)}
                </div>
                <button className={classNames(Style["button"], "btn-effect one")}
                        onClick={() => that.handleGoToPopularWebinars(groupByCategory.category.id)}>All
                  in {groupByCategory.category.categoryName}</button>
              </div>
            </div>
          );


        })
        }
      </div>
    );
  };

  renderMobilePopularWebinars = (list) => (
    <Carousel showArrows={false} showThumbs={false} showStatus={false}>{this.renderProducts(list)}</Carousel>
  );

  handleGoToPopularProducts = (id) => {
    const {
      history,
      onProductDataClear
    } = this.props;
    onProductDataClear()
    history.push(`/products?categories=${id}`);
  };

  handleGoToPopularWebinars = (id) => {
    const {
      history,
      onProductDataClear
    } = this.props;
    onProductDataClear()
    history.push(`/webinars?categories=${id}`);
  };

  render() {

    return (
      <div className={Style["container"]}>
        <div className={Style["fluid-container"]}>
          {
            (
              this.props.popularProducts
              && Object.keys(this.props.popularProducts).length > 0
            ) ? this.renderPopularProducts(this.props.popularProducts) : null
          }

          {
            (
              this.props.popularWebinars
              && Object.keys(this.props.popularWebinars).length > 0
            ) ? this.renderPopularWebinars(this.props.popularWebinars) : null
          }

        </div>
      </div>
    );
  }
};
