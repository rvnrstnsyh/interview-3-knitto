import Http from '../../../../helpers/classes/Http.ts'

import { FreshContext, Handlers } from '$fresh/server.ts'
import { sql } from '../../../../helpers/functions/mysql.ts'

export const handler: Handlers = {
	async POST(_request: Request, ctx: FreshContext): Promise<Response> {
		const { unique_code } = ctx.state as { unique_code: string }

		if (!unique_code) {
			return Http.json(Http.data({
				success: false,
				code: 400,
				type: 'unique-item',
				message: '-ERR unique code is required',
			}))
		}

		let retries = 3
		while (retries > 0) {
			try {
				await sql.query('START TRANSACTION')

				const [lastItem] = await sql.query(
					'SELECT running_number FROM items WHERE unique_code = ? ORDER BY running_number DESC LIMIT 1 FOR UPDATE',
					[
						unique_code,
					],
				)
				const newRunningNumber = lastItem ? lastItem.running_number + 1 : 1
				const result = await sql.query(
					'INSERT INTO items (unique_code, running_number) VALUES (?, ?) ON DUPLICATE KEY UPDATE running_number = VALUES(running_number)',
					[unique_code, newRunningNumber],
				)

				await sql.query('COMMIT')

				if (result.affectedRows > 0) {
					return Http.json(Http.data({
						success: true,
						code: 201,
						type: 'unique-item',
						message: '+OK data saved successfully.',
						data: {
							unique_code,
							running_number: newRunningNumber,
						},
					}))
				}

				retries--
			} catch (error) {
				await sql.query('ROLLBACK')
				retries--
				if (retries === 0) {
					return Http.json(Http.data({
						success: false,
						code: 500,
						type: 'unique-item',
						message: `-ERR ${error instanceof Error ? error.message : 'unknown error'}`,
					}))
				}
			}
		}

		return Http.json(Http.data({
			success: false,
			code: 500,
			type: 'unique-item',
			message: '-ERR Failed to save data after multiple attempts',
		}))
	},
}
