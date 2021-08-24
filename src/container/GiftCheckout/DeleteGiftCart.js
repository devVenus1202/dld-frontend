export default function deleteCart(data) {
  let cartProductSession = JSON.parse(localStorage.getItem("giftCartProduct"));
  //console.log(cartProductSession);

  var productData = [];
  var productCountData = 0;
  productData = cartProductSession.product;

  var obj = findObjectByKey(
    "productId",
    data.productId,
    cartProductSession.product,
    data
  );
  productData = obj;
  productCountData = obj.length;

  var prod = { productCount: productCountData, product: productData };
  localStorage.setItem("giftCartProduct", JSON.stringify(prod));

  return null;
}

function findObjectByKey(key, value, productArray, data) {
  let array = productArray;

  for (var i = 0; i < array.length; i++) {
    //console.log(array[i][key]+" _ "+value)
    if (array[i][key] === value) {
      array.splice(i, 1);
    }
  }
  return array;
}
