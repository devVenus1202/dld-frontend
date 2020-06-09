import firebase from 'firebase'
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import {isAuth} from "./user";
import {saveUserDevice} from "./pwaUser";


const firebaseConfig = {
    databaseURL: 'https://dld-vip.firebaseio.com',
    messagingSenderId: '314383176072',
}
let messaging

//PWA
export const initializeFirebase = () => {
    console.log('initializeFirebase')
    firebase.initializeApp(firebaseConfig)
    navigator.serviceWorker
        .getRegistration()
        .then((registration) => {
            messaging = firebase.messaging()
            messaging.usePublicVapidKey('BJFtQYQfVRNeeoBfN5LquzYeWqre7pXYGrd8nfIgOdLzLpHS0amtUhLBIve2K9tt5Lmw7T-xvyIiqiklGBQE9Jc')
            messaging.useServiceWorker(registration)
            
            askForPermissionToReceiveNotifications().catch(console.log);
            
            messaging.onMessage((payload) => {
                console.log('---------------------------')
                console.log('---------------------------')
                console.log('---------------------------')
                console.log('Message received. ', payload);
            });
            
        })
}

//PWA
export const askForPermissionToReceiveNotifications = async () => {
    try {
        console.log('askForPermissionToReceiveNotifications')
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
            const token = await messaging.getToken();
            await saveUserDevice(token);
            return token
        } else {
            console.log('Unable to get permission to notify.')
        }
    } catch (error) {
        console.error(error)
    }
}


export const initPWA = () => {
    try {
        
        OfflinePluginRuntime.install({
            responseStrategy: 'network-first',
            version: +new Date()
        })
        
        if (isAuth()) {
            let interval = setInterval(() => {
                if (navigator.serviceWorker.controller) {
                    console.log('initPWA')
                    console.log('on')
                    initializeFirebase();
                    clearInterval(interval)
                } else {
                    console.log('off')
                }

            }, 300);
        }
    } catch (error) {
        console.error(error)
    }
};