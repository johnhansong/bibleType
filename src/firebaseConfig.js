import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  projectId: PROJECTID,
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGESENDERID,
  appId: APPID,
  measurementId: MEASUREMENTID
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const auth = firebase.auth();
const db = firebaseApp.firestore();

export { auth, db }
