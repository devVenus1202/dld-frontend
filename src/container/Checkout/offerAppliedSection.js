export default function createOfferAplication(data) {
    let dataValue = data.cartProduct;
    let totalCount = 0;
    for(let i =0 ; i< dataValue.length; i++) {
       if(dataValue[i].type !== "giftcard") {
            totalCount += Number(dataValue[i].sum);
       }
    }
    
    return totalCount;
    
}