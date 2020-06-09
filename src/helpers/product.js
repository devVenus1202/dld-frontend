import {PRODUCT_DIGITAL, PRODUCT_PHYSICAL, DLD_IMAGE_PLACEHOLDER} from "../constants";
import {AppConfig} from "../config/AppConfig";


export const isPhysicalProduct = ({status}) => {
  return status === PRODUCT_PHYSICAL
}

export const isDigitalProduct = ({status}) => {
  return status === PRODUCT_DIGITAL
}

export const getProductImg = (item) => {
  const {productImageThumbnail, productImage} = item

  return (productImageThumbnail)
    ? toImgPreviewCDN(item)
    : (productImage) ? toImgCDN(item) : DLD_IMAGE_PLACEHOLDER;
}


export const onProductImgError = (e) =>{
    e.target.onError = null;
    e.target.src = DLD_IMAGE_PLACEHOLDER;
}

const toImgPreviewCDN = (item) => {
  const {productImageThumbnail} = item;
  const expression = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
  const regex = new RegExp(expression);
  if ( productImageThumbnail.match(regex))
    return productImageThumbnail;
  return AppConfig.cdn + productImageThumbnail;
}

export const toImgCDN = (item) => {
  const {productImage} = item;
  const expression = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
  const regex = new RegExp(expression);
  if ( productImage.match(regex))
    return productImage;
  return AppConfig.cdn + productImage
}