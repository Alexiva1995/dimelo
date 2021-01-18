import  firebase from 'firebase/app';
import 'firebase/firestore';

const projects = {
    '[DEFAULT]':{
        apiKey: "AIzaSyDn8dkzdMTtJQR4aaElPzLvqocdEdsW0fo",
        authDomain: "dimelo-vip.firebaseapp.com",
        projectId: "dimelo-vip",
        storageBucket: "dimelo-vip.appspot.com",
        messagingSenderId: "279218688620",
        appId: "1:279218688620:web:cbf4dd5511e8004ab2be49"
    },
    firestore:null,
};



Object.entries(projects)
    .forEach(([key, value])=>firebase.initializeApp({...projects['[DEFAULT]'], ...value}, key));
export default firebase