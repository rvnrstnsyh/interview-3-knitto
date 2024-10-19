import GoogleOauthButton from './google-oauth-button.tsx'

import type { Signal } from '@preact/signals'
import type { JSX } from 'preact/jsx-runtime'

import { useState } from 'preact/hooks'

interface SignalProps {
	isLogin: Signal<number>
}

export default function LoginForm(props: SignalProps): JSX.Element {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [errorMessage, setErrorMessage] = useState<string>('')

	const submitHandler = (event: SubmitEvent) => {
		event.preventDefault()

		setSuccessMessage('')
		setErrorMessage('')

		fetch('/api/v0/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					setSuccessMessage(data.message)
					setTimeout(() => globalThis.location.href = '/dashboard', 500)
				} else {
					setErrorMessage(data.message)
				}
			})
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

			<div class='flex justify-between'>
				<div class='flex items-start'>
					<div class='flex items-center h-5'>
						<input
							id='remember'
							type='checkbox'
							value=''
							class='w-4 h-4 rounded bg-slate-100 focus:ring-2 focus:ring-primary'
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
