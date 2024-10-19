import LoginForm from './login-form.tsx'
import RegisterForm from './register-form.tsx'

import type { JSX } from 'preact/jsx-runtime'

import { asset } from '$fresh/src/runtime/utils.ts'
import { computed, Signal, signal } from '@preact/signals'

export default function AuthModal(): JSX.Element {
	const isLogin: Signal<number> = signal<number>(1)
	const modalClasses: string[] = [
		'hidden',
		'overflow-y-auto',
		'overflow-x-hidden',
		'fixed',
		'top-0',
		'right-0',
		'left-0',
		'z-50',
		'justify-center',
		'items-center',
		'w-full',
		'md:inset-0',
		'h-[calc(100%-1rem)]',
		'max-h-full',
	]

	return (
		<div>
			<button class='authentication-button' type='button' data-modal-target='authentication-modal' data-modal-toggle='authentication-modal'>
				Authentication
			</button>
			<div class={modalClasses.join(' ')} id='authentication-modal' data-modal-backdrop='static' tabIndex={-1} aria-hidden='true'>
				<div class='wrapper'>
					<div class='body'>
						<div class='title'>
							<h3>
								Sign {computed(() => isLogin.value ? 'In' : 'Up')} to Our Platform
							</h3>
							<button type='button' data-modal-hide='authentication-modal'>
								<img src={asset('/assets/svg/cross.svg')} alt='Close Button' />
								<span class='sr-only'>Close modal</span>
							</button>
						</div>
						<div class='form-wrapper'>
							{computed(() => isLogin.value ? <LoginForm isLogin={isLogin} /> : <RegisterForm isLogin={isLogin} />)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
