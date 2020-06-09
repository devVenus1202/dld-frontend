import {PRODUCT_DIGITAL} from "../constants";

export const buildProductLink = (item) =>{
  return ["", item.status, item.productSlug].join("/")
}

export const getProperCatalogLink = (status) => {
  return status === PRODUCT_DIGITAL ? getWebinarsLink() : getProductsLink();
}

export const getProductsLink = () => '/products'
export const getWebinarsLink = () => '/webinars'