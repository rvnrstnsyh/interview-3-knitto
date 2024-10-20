import { z } from 'zod'

export const transactionSchema = z.object({
	userId: z.number().int().nonnegative(),
	amount: z.number().positive(),
	description: z.string().min(1),
})

export type TransactionValidationSchema = z.infer<typeof transactionSchema>

export default transactionSchema
