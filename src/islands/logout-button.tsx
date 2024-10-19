import type { JSX } from 'preact/jsx-runtime'

export default function LogoutButton(): JSX.Element {
	const logoutHandler = () => {
		fetch('/api/v0/auth/login', { method: 'GET' })
			.then((response) => {
				if (response.ok) globalThis.location.reload()
			})
			.catch((_error) => {
				return
			})
	}
	return (
		<button class='authentication-button' type='button' onClick={logoutHandler}>
			Log out
		</button>
	)
}
