import React, {Component} from "react";
import SmallCommentBlock from "../../../SmallCommentBlock";
import {getProductImg, isDigitalProduct, onProductImgError} from "../../../../../helpers/product";

class ShopPageListItem extends Component {

  getProductsPhysicalDetail(item) {
    let result = false;

    try {
      if (item && item.productsphysicaldetail) {
        result = item.productsphysicaldetail.data;
      }
    } catch (e) {
      console.log(e);
    }

    return result;
  }

  getCommentsCount(item) {
    return isDigitalProduct(item) ? (item.usercomments && item.usercomments.length) || 0 : '';
  }

  render() {
    const {keyIndex, onClick, item} = this.props;
    if (!item) {
      return null;
    }
    const productsPhysicalDetails = this.getProductsPhysicalDetail(item);
    const commentsCount = this.getCommentsCount(item);
    return (
      <div className="item width-product-list" key={keyIndex} id={item.id}>
        <div className="product-item img-shine-effect">
          <a onClick={onClick} className="product-inner shine-effect-inner clearfix">
            <div className="image-block hidden-img">
              <div className="list-image">
                <img alt="..." src={getProductImg(item)} onError={onProductImgError}/>
              </div>
            </div>
            <div className="product-info">
              <h4 className="product-name product_title">{item.productName}</h4>
            </div>
            <div className="product-group-info">
              <div className="price">
                <span className="Price-amount">
                    {item.strokedProductPrice && item.strokedProductPrice != item.productPrice &&
                    <span>
                        <span className="currencySymbol">$</span><strike>{item.strokedProductPrice}</strike>
                      </span>
                    }
                    <span><span
                      className="currencySymbol">$</span>{item.productPrice}
                  </span>

                </span>
              </div>
              {
                (isDigitalProduct(item))
                  ? (
                    <div className="remaing-items">
                    <span>
                        <font>{item.remainingQuantity}</font>{" "}Views Remaining
                    </span>
                    </div>
                  )
                  : ""
              }
              {
                isDigitalProduct(item) && (
                  <div className="comment-block">
                    <p className="comment-label">
                      <span className="icon"/>
                      {commentsCount ? (
                        <span>{commentsCount} comments </span>
                      ) : (
                        <span>Leave a comment</span>
                      )}
                    </p>
                  </div>
                )
              }
            </div>
          </a>
          {
            isDigitalProduct(item) && (
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
    )
  }
}

export default ShopPageListItem;