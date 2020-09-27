// import firebase from "firebase";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

const env = process.env.NODE_ENV;

const config = {
  production: {
    apiKey: 'AIzaSyBIu26xVGKfFL17M9gw6zIOob1WW_rLR2Y',
    authDomain: 'hfpsbilling.firebaseapp.com',
    databaseURL: 'https://hfpsbilling.firebaseio.com',
    projectId: 'hfpsbilling',
    storageBucket: 'hfpsbilling.appspot.com',
    messagingSenderId: '161924434046',
    appId: '1:161924434046:web:0617822c1ae574f0d0b02f',
    measurementId: 'G-TF7HB56XF9'
  },
  development: {
    apiKey: 'AIzaSyDd8JVBpkU84V6s-j8RwczOOi4ngkA_8Jc',
    authDomain: 'art-invoice-app.firebaseapp.com',
    databaseURL: 'https://art-invoice-app.firebaseio.com',
    projectId: 'art-invoice-app',
    storageBucket: 'art-invoice-app.appspot.com',
    messagingSenderId: '251098210481',
    appId: '1:251098210481:web:7db9095b090df4444dc290',
    measurementId: 'G-DT4DHY6EGW'
  }
};
firebase.initializeApp(config[env]);
export const fb = firebase.firestore;
export const auth = firebase.auth;
export const db = firebase.firestore();
export const fbf = firebase.functions();
export const storage = firebase.storage();
