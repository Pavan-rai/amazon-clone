import  firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCJPCkXrd8lEGICxuFtIPaRguAIYphN5Rg",
    authDomain: "challenge-e706e.firebaseapp.com",
    projectId: "challenge-e706e",
    storageBucket: "challenge-e706e.appspot.com",
    messagingSenderId: "36344885506",
    appId: "1:36344885506:web:2d97d8efba6138da53121b",
    measurementId: "G-G6K4GVDHDZ"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export { db, auth };