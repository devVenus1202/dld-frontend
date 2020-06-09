
export default function localCart(data) {
    let giftCartProductSession=JSON.parse(localStorage.getItem('giftCartProduct'));
    
    var productData = [];
    var productCountData=0;
    if(giftCartProductSession)
    {
        if(giftCartProductSession.productCount === 0) {
            productData.push(data);
            productCountData=1;
           // ToastStore.success("Product has been added successfully in your Cart");
        }
        else {
            productData = giftCartProductSession.product;
            var obj = findObjectByKey('productId', data.productId,giftCartProductSession.product,data);
            productData = obj;
            productCountData =obj.length;
        }
        var prod={productCount: productCountData, product : productData};
        //console.log(prod);
        localStorage.setItem('giftCartProduct', JSON.stringify(prod)); 
    }
    return null;
}

function findObjectByKey(key, value,productArray, data) {
    let array = productArray;
    let flag=0;
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            flag++;
            array[i][key] = value;
            array[i].count = data.count;
            //ToastStore.success("Product has been updated successfully in your Cart");
        }
    }
    if(flag===0)
    {
        array.push(data);
        //ToastStore.success("Product has been added successfully in your Cart");
    }
        
    return array;
}