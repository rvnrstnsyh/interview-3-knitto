import type { Signal } from '@preact/signals'
import type { JSX } from 'preact/jsx-runtime'
import GoogleOauthButton from './google-oauth-button.tsx'

interface SignalProps {
	isLogin: Signal<number>
}

export default function RegisterForm(props: SignalProps): JSX.Element {
	return (
		<form action='#'>
			<div class='input-wrapper'>
				<label for='email'>Email</label>
				<input
					type='email'
					name='email'
					id='email'
					placeholder='name@company.com'
					required
				/>
			</div>
			<div class='input-wrapper'>
				<label for='password'>Password</label>
				<input
					type='password'
					name='password'
					id='password'
					placeholder='••••••••'
					required
				/>
			</div>
			<div class='input-wrapper'>
				<label for='password'>Confirm password</label>
				<input
					type='password'
					name='password'
					id='password'
					placeholder='••••••••'
					required
				/>
			</div>
			<button type='submit' class='default-button'>
				Create new account
			</button>
			<div class='flex items-center my-4'>
				<div class='flex-grow border-t border-gray-300'></div>
				<span class='px-4 text-gray-500'>OR</span>
				<div class='flex-grow border-t border-gray-300'></div>
			</div>
			<GoogleOauthButton />
			<div class='text-sm text-gray-500'>
				Already registered?&nbsp;<span class='text-blue-800 underline hover:no-underline cursor-pointer' onClick={() => props.isLogin.value ^= 1}>
					Login
				</span>
			</div>
		</form>
	)
}
