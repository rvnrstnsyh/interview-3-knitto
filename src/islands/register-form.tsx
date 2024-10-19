import GoogleOauthButton from './google-oauth-button.tsx'

import type { Signal } from '@preact/signals'
import type { JSX } from 'preact/jsx-runtime'

import { useState } from 'preact/hooks'

interface SignalProps {
	isLogin: Signal<number>
}

export default function RegisterForm(props: SignalProps): JSX.Element {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [confirmPassword, setConfirmPassword] = useState<string>('')
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [errorMessage, setErrorMessage] = useState<string>('')

	const submitHandler = (event: SubmitEvent) => {
		event.preventDefault()

		setSuccessMessage('')
		setErrorMessage('')

		fetch('/api/v0/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password, confirm_password: confirmPassword }),
		})
			.then((response) => response.json())
			.then((data) => data.success ? setSuccessMessage(data.message) : setErrorMessage(data.message))
			.catch((_error) => {
				return
			})
	}

	return (
		<form onSubmit={submitHandler}>
			{successMessage && !errorMessage && (
				<div class='p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400' role='alert'>
					<span class='font-medium'>+OK</span> {successMessage.replace('+OK', '')}
				</div>
			)}
			{!successMessage && errorMessage && (
				<div class='p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400' role='alert'>
					<span class='font-medium'>-ERR</span> {errorMessage.replace('-ERR', '')}
				</div>
			)}

			<div class='input-wrapper'>
				<label for='email'>Email</label>
				<input
					type='email'
					name='email'
					id='email'
					placeholder='name@company.com'
					required
					value={email}
					onInput={(event) => setEmail((event.target as HTMLInputElement).value)}
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
					value={password}
					onInput={(event) => setPassword((event.target as HTMLInputElement).value)}
				/>
			</div>
			<div class='input-wrapper'>
				<label for='confirm_password'>Confirm password</label>
				<input
					type='password'
					name='confirm_password'
					id='confirm_password'
					placeholder='••••••••'
					required
					value={confirmPassword}
					onInput={(event) => setConfirmPassword((event.target as HTMLInputElement).value)}
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
				Already registered?&nbsp;
				<span class='text-blue-800 underline hover:no-underline cursor-pointer' onClick={() => props.isLogin.value ^= 1}>
					Login
				</span>
			</div>
		</form>
	)
}
