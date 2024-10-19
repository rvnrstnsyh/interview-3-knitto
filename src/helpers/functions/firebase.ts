// Import the functions you need from the SDKs you need
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDMhlLN4DcnJhmNYI3pop86uSkIJTnS1Zo',
	authDomain: 'knitto-13e1b.firebaseapp.com',
	projectId: 'knitto-13e1b',
	storageBucket: 'knitto-13e1b.appspot.com',
	messagingSenderId: '835034426876',
	appId: '1:835034426876:web:a95a9abecccddfe3d19679',
	measurementId: 'G-VZW2DLWKNQ',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { app, auth }
