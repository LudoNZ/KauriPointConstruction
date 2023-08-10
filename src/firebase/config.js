import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

// config
const firebaseConfig = {
  apiKey: "AIzaSyAPr07WPBDwQWlCJiJ3rp76GTmf4y4nygU",
  authDomain: "kauri-point-construction.firebaseapp.com",
  databaseURL: "https://kauri-point-construction-default-rtdb.firebaseio.com",
  projectId: "kauri-point-construction",
  storageBucket: "kauri-point-construction.appspot.com",
  messagingSenderId: "461291327484",
  appId: "1:461291327484:web:a4cce1dadab969727b6c79",
  measurementId: "G-177Z0EVXXG",
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

// timestamp
const timestamp = firebase.firestore.Timestamp;

export { projectFirestore, projectAuth, projectStorage, timestamp };
