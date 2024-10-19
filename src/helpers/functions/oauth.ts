import { auth } from './firebase.ts'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export const signInWithGoogle = async () => {
	const provider = new GoogleAuthProvider()
	return await signInWithPopup(auth, provider)
}

export const logout = async () => {
	return await auth.signOut()
}
