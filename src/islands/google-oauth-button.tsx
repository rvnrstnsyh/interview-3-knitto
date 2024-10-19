import type { JSX } from 'preact/jsx-runtime'

import { asset } from '$fresh/runtime.ts'
import { useAuth } from './oauth-context.tsx'

export default function GoogleOauthButton(): JSX.Element {
	const { userLoggedIn, loading, loginWithGoogle } = useAuth()
	const handleLogin = async () => {
		if (!userLoggedIn && !loading) {
			try {
				await loginWithGoogle()
				console.log(userLoggedIn)
			} catch (error) {
				console.error('-ERR signing in with Google:', error)
			}
		}
	}

	if (loading) return <button disabled>Loading...</button>

	return (
		<button type='button' class='default-button button-with-logo' onClick={handleLogin} disabled={userLoggedIn}>
			<img class='w-5 h-5 mr-2' src={asset('/assets/svg/google.svg')} alt='Google Logo' />
			<span>{userLoggedIn ? 'Logged In' : 'Login with Google'}</span>
		</button>
	)
}
