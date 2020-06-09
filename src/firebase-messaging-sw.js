importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js')
const firebaseConfig = {
  databaseURL: "https://dld-vip.firebaseio.com",
  messagingSenderId: "314383176072",
};
firebase.initializeApp(firebaseConfig)


const messaging = firebase.messaging()
