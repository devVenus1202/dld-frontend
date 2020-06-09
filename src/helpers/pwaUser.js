import {ApiHelper} from './ApiHelper';

//PWA
export const saveUserDevice = async (token) => {
    let api = new ApiHelper();
    console.log('saveUserDevice')
    let result = await api.FetchFromServer('/', 'user/saveTokenDevice', 'POST', true, undefined, {devToken:token});
    
    if (!result.isError) {
        console.log(result);
    }
};