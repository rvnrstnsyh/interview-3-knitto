import LogoutButton from '../../../islands/logout-button.tsx'

import { type PageProps } from '$fresh/server.ts'

import { JSX } from 'preact/jsx-runtime'
import { load } from '$std/dotenv/mod.ts'
import { asset } from '$fresh/src/runtime/utils.ts'

const env: Record<string, string> = await load({ envPath: '.env', export: true })

interface User {
	id: number
	email: string
}

export default function Entrance(ctx: PageProps): JSX.Element {
	return (
		<div class='px-4 py-8 mx-auto'>
			<div class='max-w-screen-md mx-auto flex flex-col items-center justify-center'>
				<img class='my-10 w-52 h-52' src={asset('/assets/svg/knitto.svg')} alt={`${env['APP_NAME'] as string} logo`} />
				<h1 class='text-4xl font-bold'>Hello {(ctx.state.user as User).email}!</h1>
				<p class='my-4'>
					See the <code class='mx-2 bg-gray'>./README.md</code> file for further API specifications.
				</p>
				<LogoutButton />
			</div>
		</div>
	)
}
