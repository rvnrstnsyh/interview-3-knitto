import type { JSX } from 'preact/jsx-runtime'

import { asset } from '$fresh/src/runtime/utils.ts'

export default function GoogleOauthButton(): JSX.Element {
	return (
		<button type='submit' class='default-button button-with-logo'>
			<img class='w-5 h-5 text-blue-800' src={asset('/assets/svg/google.svg')} alt='Google Logo' />
			<span>Login with Google</span>
		</button>
	)
}
