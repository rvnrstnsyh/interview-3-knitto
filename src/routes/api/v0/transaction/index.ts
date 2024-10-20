import Http from '../../../../helpers/classes/Http.ts'
import { FreshContext, Handlers } from '$fresh/server.ts'
import { sql } from '../../../../helpers/functions/mysql.ts'

export const handler: Handlers = {
	async POST(_request: Request, ctx: FreshContext): Promise<Response> {
		const { transactionData } = ctx.state as { transactionData: { userId: number; amount: number; description: string } }

		if (!transactionData) {
			return Http.json(Http.data({
				success: false,
				code: 400,
				type: 'transaction',
				message: '-ERR invalid or missing transaction data',
			}))
		}

		try {
			await sql.execute(`START TRANSACTION`)

			const result = await sql.query(`SELECT balance FROM users WHERE id = ?`, [transactionData.userId])

			if (result.length === 0) {
				return Http.json(Http.data({
					success: false,
					code: 400,
					type: 'transaction',
					message: '-ERR user account not found',
				}))
			}

			const currentBalance = result[0].balance

			if (currentBalance < transactionData.amount) {
				return Http.json(Http.data({
					success: false,
					code: 400,
					type: 'transaction',
					message: '-ERR insufficient funds',
				}))
			}

			// Update balance in users table
			await sql.execute(
				`
        UPDATE users 
        SET balance = balance - ? 
        WHERE id = ?
      `,
				[transactionData.amount, transactionData.userId],
			)

			// Insert into transactions table
			const transactionResult = await sql.execute(
				`
        INSERT INTO transactions (user_id, amount, description) 
        VALUES (?, ?, ?)
      `,
				[transactionData.userId, transactionData.amount, transactionData.description],
			)

			// Insert into transaction_logs with transaction_id
			await sql.execute(
				`
        INSERT INTO transaction_logs (user_id, transaction_id, action, amount) 
        VALUES (?, ?, 'debit', ?)
      `,
				[transactionData.userId, transactionResult.lastInsertId, transactionData.amount],
			)

			await sql.execute(`COMMIT`)

			return Http.json(Http.data({
				success: true,
				code: 200,
				type: 'transaction',
				message: '+OK transaction completed successfully',
				data: { newBalance: currentBalance - transactionData.amount },
			}))
		} catch (error) {
			await sql.execute(`ROLLBACK`)
			return Http.json(Http.data({
				success: false,
				code: 500,
				type: 'transaction',
				message: `-ERR failed to process transaction: ${error instanceof Error ? error.message : 'unknown error'}`,
			}))
		}
	},
}
