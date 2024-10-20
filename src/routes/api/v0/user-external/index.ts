import Http from '../../../../helpers/classes/Http.ts'

import { FreshContext, Handlers } from '$fresh/server.ts'

export const handler: Handlers = {
	async POST(_request: Request, ctx: FreshContext): Promise<Response> {
		const { id } = ctx.state as { id: number }

		if (!id || isNaN(Number(id)) || id <= 0) {
			return Http.json(Http.data({
				success: false,
				code: 400,
				type: 'user-external',
				message: '-ERR invalid or missing id',
			}))
		}

		try {
			const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)

			if (!response.ok) {
				if (response.status === 404) {
					return Http.json(Http.data({
						success: false,
						code: 404,
						type: 'user-external',
						message: '-ERR user not found',
					}))
				}
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const user = await response.json()

			return Http.json(Http.data({
				success: true,
				code: 200,
				type: 'user-external',
				message: '+OK user fetched successfully',
				data: { user },
			}))
		} catch (error) {
			console.error('Error fetching user:', error)
			return Http.json(Http.data({
				success: false,
				code: 500,
				type: 'user-external',
				message: '-ERR failed to fetch user',
			}))
		}
	},
}
