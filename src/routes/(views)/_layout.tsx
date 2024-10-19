import { JSX } from 'preact/jsx-runtime'
import { PageProps } from '$fresh/server.ts'
import AuthProvider from '../../islands/oauth-context.tsx'

export default function Layout({ Component }: PageProps): JSX.Element {
	return (
		<AuthProvider>
			<section class='root-container'>
				<div class='content-wrapper'>
					<Component />
				</div>
			</section>
		</AuthProvider>
	)
}
