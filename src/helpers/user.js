
export const isAuth = () => {
    
    const storageSession = JSON.parse(
        localStorage.getItem("localStorageVal")
    );
    
    if (storageSession && storageSession.token) {
        return true;
    } else {
        return false;
    }
};

export const getToken = () => {
    
    const storageSession = JSON.parse(
        localStorage.getItem("localStorageVal")
    );
    
    if (storageSession && storageSession.token) {
        return storageSession.token;
    } else {
        return false;
    }
};

export const updateToken = (data) => {
    var localStorage_array = {token: data.token, isLoggingIn: true};
    localStorage.setItem(
        "localStorageVal",
        JSON.stringify(localStorage_array)
    );
}