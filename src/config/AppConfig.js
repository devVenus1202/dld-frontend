const mode = process.env.REACT_APP_STAGE || "live";
export const isProd = mode === "live";
let data;

console.log('#############################################')
console.log('mode', mode)
console.log('#############################################')


switch (mode) {
    case "live":
        data = {
            API_ENDPOINT: "/",
            API_VERSION: "api",
            frontUrl: "",
            backUrlApi: "/api",
            authorizeURL: "https://api.authorize.net/xml/v1/request.api",
            currency: "$",
            PRODUCTS_PER_PAGE: 8,
            maxAmount: 9999,
            maxAmountString: "9999,99",
            mainDomain: "",
            mode: mode,
            cdn: 'https://cdn.dld-vip.com/'
        };
        break;
    case "stage":
        data = {
            API_ENDPOINT: "http://test.dld-vip.com/",
            API_VERSION: "api",
            frontUrl: "",
            backUrlApi: "http://test.dld-vip.com/api",
            authorizeURL: "http://apitest.authorize.net/xml/v1/request.api",
            currency: "$",
            PRODUCTS_PER_PAGE: 8,
            maxAmount: 9999,
            maxAmountString: "9999,99",
            mainDomain: "https://test.dld-vip.com",
            mode: mode,
            cdn: 'https://cdn.test.dld-vip.com/'
        };
        break;
    case "local":
        data = {
            API_ENDPOINT: "http://localhost:8000/",
            API_VERSION: "api",
            frontUrl: "",
            backUrlApi: "http://localhost:8000/api",
            authorizeURL: "https://apitest.authorize.net/xml/v1/request.api",
            currency: "$",
            PRODUCTS_PER_PAGE: 8,
            maxAmount: 9999,
            maxAmountString: "9999,99",
            mainDomain: "http://localhost:8000",
            mode,
            cdn: 'https://dv82w2v4dotud.cloudfront.net/'
        };
        break;
    default:
        data = {};
        break;
}

export const AppConfig = data;
