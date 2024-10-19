import type { JSX } from 'preact/jsx-runtime'

import { createContext } from 'preact'
import { auth } from '../helpers/functions/firebase.ts'
import { useContext, useEffect, useState } from 'preact/hooks'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, User } from 'firebase/auth'

interface AuthContextType {
	currentUser: User | null
	userLoggedIn: boolean
	loading: boolean
	loginWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
	const context = useContext(AuthContext)

	if (context === null) throw new Error('useAuth must be used within an AuthProvider')
	return context
}

export default function AuthProvider({ children }: { children: JSX.Element }): JSX.Element {
	const [currentUser, setCurrentUser] = useState<User | null>(null)
	const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user: AuthContextType['currentUser']) => {
			setCurrentUser(user ?? null)
			setUserLoggedIn(!!user)
			setLoading(false)
			if (user) globalThis.location.href = '/dashboard'
		})

		return () => unsubscribe()
	}, [])

	async function loginWithGoogle(): Promise<void> {
		const provider = new GoogleAuthProvider()
		try {
			await signInWithPopup(auth, provider)
		} catch (error) {
			console.error('Error signing in with Google', error)
			throw error
		}
	}

	const value: AuthContextType = {
		currentUser,
		userLoggedIn,
		loading,
		loginWithGoogle,
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}
