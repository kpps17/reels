import firebase from "firebase"

let firebaseConfig = {
	apiKey: "AIzaSyBox-gKM8hI7lQilrn-crthV_M4Gksi7wE",
	authDomain: "reels-clone-d597e.firebaseapp.com",
	projectId: "reels-clone-d597e",
	storageBucket: "reels-clone-d597e.appspot.com",
	messagingSenderId: "700801610329",
	appId: "1:700801610329:web:696fbe31d446dc198df748"
};

// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);
export let firebaseStorage = firebaseApp.storage();
export let firebaseAuth = firebaseApp.auth();
export let firebaseDb = firebaseApp.firestore();
export let timeStamp = firebase.firestore.FieldValue.serverTimestamp;