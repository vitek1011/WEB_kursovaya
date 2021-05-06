import firebase from "firebase";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdfyzUtQ7-LNDJVZNg_DKEA0bGZDtkmNg",
  authDomain: "ikit-is.firebaseapp.com",
  databaseURL: "https://ikit-is.firebaseio.com",
  projectId: "ikit-is",
  storageBucket: "ikit-is.appspot.com",
  messagingSenderId: "504528378654",
  appId: "1:504528378654:web:564f96d7dd3af3aa72c70f",
  measurementId: "G-8XDCTPQ73B",
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

const projectStorage = firebase.storage();
const projectFirestore = firebase.firestore();

export { projectStorage, projectFirestore };
