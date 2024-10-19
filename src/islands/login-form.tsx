import GoogleOauthButton from './google-oauth-button.tsx'

import type { Signal } from '@preact/signals'
import type { JSX } from 'preact/jsx-runtime'

interface SignalProps {
	isLogin: Signal<number>
}

export default function LoginForm(props: SignalProps): JSX.Element {
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

			<div class='flex justify-between'>
				<div class='flex items-start'>
					<div class='flex items-center h-5'>
						<input
							id='remember'
							type='checkbox'
							value=''
							class='w-4 h-4 rounded bg-slate-100 focus:ring-2 focus:ring-primary'
							required
						/>
					</div>
					<label for='remember' class='ms-2 text-sm text-gray-900'>Keep me signed in</label>
				</div>
			</div>

			<button type='submit' class='default-button'>
				Login to your account
			</button>
			<div class='flex items-center my-4'>
				<div class='flex-grow border-t border-gray-300'></div>
				<span class='px-4 text-gray-500'>OR</span>
				<div class='flex-grow border-t border-gray-300'></div>
			</div>
			<GoogleOauthButton />
			<div class='text-sm text-gray-500'>
				Not registered?&nbsp;<span class='text-blue-800 underline hover:no-underline cursor-pointer' onClick={() => props.isLogin.value ^= 1}>
					Create account
				</span>
			</div>
		</form>
	)
}
