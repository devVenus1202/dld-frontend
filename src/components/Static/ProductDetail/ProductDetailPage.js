import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import Magnifier from "react-magnifier";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import qs from 'query-string';
import { AppConfig } from "../../../config/AppConfig";
import { ApiHelper } from "../../../helpers/ApiHelper";
import { InfiniteLoaders } from "../Common/Loader/Loader";
import { getProperCatalogLink } from "../../../helpers/links";

import { toImgCDN, isDigitalProduct, onProductImgError } from "../../../helpers/product";

class ProductDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
      catalog: undefined,
      productSlug: undefined,
      errorClass: "display_none",
      errorMsg: "",
      windowWidthValue: false,
      updateRSR: false,
      Retail_Price: '',
      Retail_MAP: '',
      Inventory_Quantity: '',
    };
  }

  handleAdd(productId, remainingQuantity) {
    let count = this.state.count;
    let countNew = this.state.count + 1;
    if (countNew > remainingQuantity) {
      this.setState({
        errorClass: "errorCart errorQty",
        errorMsg: "Quantity exceed"
      });
      return;
    } else {
      this.setState({
        errorClass: "display_none",
        errorMsg: ""
      });
    }
    if (countNew > 0) {
      this.setState({ count: count + 1 });
    }
  }

  handleMinus(productId) {
    let count = this.state.count;
    let countNew = this.state.count - 1;
    if (countNew > 0) {
      this.setState({ count: count - 1 });
    }
    this.setState({
      errorClass: "display_none",
      errorMsg: ""
    });
  }

  addProductToCart(productId) {
    var data = {
      productId: productId,
      count: this.state.count,
      type: 'physical'
    };
    this.props.addToCart(data);
  }

  async updatePrace() {
    const { productDetails } = this.props;
    const { productData } = productDetails;
    if (productData.productsphysicaldetail) {
      let dataValue = {
        productId: productData.id,
      };
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
        "/",
        "product/updateSRSData",
        "POST",
        true,
        undefined,
        dataValue
      );

      if (result.isError) {

        this.setState({
          updateRSR: false
        });

      } else {
        if (result.data && result.data.data) {
          this.setState({
            updateRSR: false,
            /*Retail_Price: result.data.data['Retail Price'],
            Retail_MAP: result.data.data['Retail MAP'],*/
            Inventory_Quantity: result.data.data['Inventory Quantity'],
          });
        } else {
          this.setState({
            updateRSR: false
          });
        }

      }
    } else {
      this.setState({
        updateRSR: false
      });
    }

  }

  async componentWillMount() {
    const { match } = this.props;
    const { params } = match;
    const { catalog, productslug } = params;
    this.setState({
      catalog,
      productslug
    });
  }

  componentDidMount() {
    let winWidth = window.innerWidth;
    if (winWidth < 768) {
      this.setState({
        windowWidthValue: true
      });
    }
  }

  isMobile = () => {
    return window.innerWidth <= 1040;
  };

  getMapDataAttr(dataAttrJson) {
    let result = [];

    for (let key in dataAttrJson) {
      if (dataAttrJson[key]) {
        result.push({ label: key, value: dataAttrJson[key] });
      }


    }

    return result;
  }

  
  renderBuyButton = (productData, Inventory_Quantity) =>{
    if (productData.source===2 && !productData.rsrAvailable)
      return <div className="errorCart">Currently, this product is not available.{productData.rsrAvaialble}</div>
      
    return ( <div><div className="quantity">
      <div className="control">
        <span
          className="btn-number qtyminus quantity-minus"
          onClick={this.handleMinus.bind(this, productData.id)}
        >
          -
    </span>
        <input
          type="text"
          data-step="1"
          data-min="1"
          data-max=""
          name="quantity"
          value={this.state.count}
          title="Qty"
          className="input-qty qty"
          size="4"
          min="1"
          max=""
        />
        <span
          className="btn-number qtyplus quantity-plus"
          onClick={this.handleAdd.bind(
            this,
            productData.id,
            parseInt(Inventory_Quantity || productData.remainingQuantity)
          )}
        >
          +
                                      </span>
      </div>
    </div>
   
      <button
        type="submit"
        className="add-cart-btn btn-effect one"
        onClick={this.addProductToCart.bind(this, productData.id)}
      >
        Add to cart
      </button>}
  </div>)
  }

  render() {
    const { productDetails, clearProductList } = this.props;
    const { productData, avgRating, totalRatings } = productDetails;
    const { updateRSR, Inventory_Quantity } = this.state;
    let data = productData.productsphysicaldetail && productData.productsphysicaldetail.data;
    let dataAttr = productData.productsphysicaldetail && productData.productsphysicaldetail.dataAttr;

    if (dataAttr) {
      try {
        if (typeof dataAttr === 'string') {
          dataAttr = JSON.parse(dataAttr);
        }
        dataAttr = this.getMapDataAttr(dataAttr);
      } catch (e) { }
    }

    let breadcrumbCatalogRedirectUrl = "/catalog";

    if (productData.status === 'digital') {
      breadcrumbCatalogRedirectUrl += '?status=digital';
    } else {
      breadcrumbCatalogRedirectUrl += '?status=physical';
    }

    /*if (data && updateRSR && productData.isActive) {
      this.updatePrace();
    }*/


    return (
      <div>
        <nav className="breadcrumb">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <Link onClick={clearProductList} to={breadcrumbCatalogRedirectUrl}>
                {" "}
                {"Catalog"}
              </Link>
            </li>
            <li>{productData.productName}</li>
          </ul>
        </nav>
        <div className="row">
          <div className="col-sm-12 product-detail-content">
            <div className="product-type product-block">
              <div className="product-gallery product-gallery-col">
                <div className="image-holder-zoom">
                  {
                    productData.productImage
                    && (
                      <TransformWrapper pan={{ disabled: true }}>
                        <TransformComponent>
                          <img src={toImgCDN(productData)} alt="product" />
                        </TransformComponent>
                      </TransformWrapper>
                      // this.isMobile()?
                      // <TransformWrapper style={{width:"100%"}}>
                      //   <TransformComponent>
                      //     <img  src={`https://cdn.dld-vip.com/6ad257f968edc56803b15dd7bac81a890871af3c.png`} alt="test" />
                      //   </TransformComponent>
                      // </TransformWrapper>:
                      // <Magnifier
                      //   src={toImgCDN(productData)}
                      //   mgShape={'square'}
                      // />
                    )
                  }
                  {
                    !productData.productImage && !!Object.keys(productData).length && (
                      <img src="/assets/img/img-dld-placeholder.jpg" alt="" />
                    )
                  }
                </div>
              </div>
              <div className="product-summary product-summary-col">
                <h1 className="product-title">{productData.productName}</h1>
                <h5 className="product-limitations">This product can be delivered to a limited number of states.</h5>
                <div className="product-review">
                  <span className="star-icons">
                    {avgRating ? (
                      <StarRatingComponent
                        name="rate1"
                        starCount={5}
                        editing={false}
                        value={avgRating}
                      />
                    ) : (
                        <StarRatingComponent
                          name="rate1"
                          starCount={5}
                          editing={false}
                          value={0}
                        />
                      )}
                  </span>
                  <span className="review-link" rel="nofollow">
                    (<span className="count">{totalRatings}</span> customer review)
                  </span>
                </div>

                {(data)
                  ? (
                    (updateRSR)
                      ? (<InfiniteLoaders />)
                      : (
                        <p className="price">
                          <span className="Price-amount price-left">
                            <div>
                              {productData.strokedProductPrice !== productData.productPrice &&
                                <>
                                  <font className="price-currencysymbol">$</font><strike>{productData.strokedProductPrice}</strike>
                                  <br />
                                </>}
                              <font className="price-currencysymbol">$</font>{productData.productPrice}
                            </div>
                          </span>
                        </p>
                      )
                  )
                  : (
                    <p className="price">
                      <span className="Price-amount price-left">
                        <span>
                          <font className="price-currencysymbol">$</font>
                          {productData.productPrice
                            ? productData.productPrice
                            : null}
                        </span>
                      </span>
                    </p>
                  )
                }


                <div className="product-details-short-description">
                  <p>{productData.shortDescription}</p>
                </div>

                {
                  (!productData.isActive)
                    ? (<div className="productDeactivate">Product is deactivated or removed</div>)
                    : (data)
                      ? (updateRSR)
                        ? (<InfiniteLoaders />)
                        : (
                          productData.remainingQuantity > 0 ?
                            this.renderBuyButton(productData, Inventory_Quantity)
                            :
                            <div>
                            </div>
                        )
                      : (
                        <div>
                          <div className="quantity">
                            <div className="control">
                              <span
                                className="btn-number qtyminus quantity-minus"
                                onClick={this.handleMinus.bind(this, productData.id)}
                              >
                                -
                                                            </span>
                              <input
                                type="text"
                                data-step="1"
                                data-min="1"
                                data-max=""
                                name="quantity"
                                value={this.state.count}
                                title="Qty"
                                className="input-qty qty"
                                size="4"
                                min="1"
                                max=""
                              />
                              <span
                                className="btn-number qtyplus quantity-plus"
                                onClick={this.handleAdd.bind(
                                  this,
                                  productData.id,
                                  parseInt(productData.remainingQuantity)
                                )}
                              >
                                +
                                                            </span>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="add-cart-btn btn-effect one notRsr"
                            onClick={this.addProductToCart.bind(this, productData.id)}
                          >
                            Add to cart
                        </button>
                        </div>
                      )
                }


                <div className={this.state.errorClass}>
                  {this.state.errorMsg}
                </div>
                <div className="product-meta">
                  <div className="sku-wrapper">
                    Type :<span className="sku">Product </span>
                  </div>
                  <div className="posted-in">
                    Categories :
                    <span>
                      {productData.category ? (
                        <Link
                          to={`${getProperCatalogLink(productData.status)}?categories=${productData.mainCateg.id}`}
                        >
                          {productData.mainCateg
                            ? productData.mainCateg.categoryName
                            : ""}
                        </Link>
                      ) : (
                          ""
                        )}
                    </span>
                  </div>

                  {
                    (dataAttr)
                      ? dataAttr.map((item, index) => {
                        return (
                          <div className="posted-in">
                            {item.label} :
                            <span className="sku">
                              {item.value}
                            </span>
                          </div>
                        );
                      })
                      : null
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// class ImageZoomComponent extends Component {
//   render() {
//     const props = this.props.propsVal;
//     return <ReactImageZoom {...props} />;
//   }
// }
export default withRouter(ProductDetailPage);
