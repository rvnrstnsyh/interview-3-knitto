import { z } from 'zod'

const predefinedSchedules = [
	'every_minute',
	'every_hour',
	'daily',
	'weekly',
	'monthly',
] as const

// Regex untuk validasi cron expression yang lebih fleksibel
const cronRegex = /^(\*|([0-9]|[1-5][0-9])|\*\/[0-9]+)(\s+(\*|([0-9]|1[0-9]|2[0-3])|\*\/[0-9]+)){4}$/

export const schema = z.object({
	taskId: z.string().min(1, 'Task ID is required'),
	schedule: z.union([
		z.enum(predefinedSchedules),
		z.string().regex(cronRegex, 'Invalid cron expression'),
	]),
	taskName: z.string().min(1, 'Task name is required'),
})

export type TaskSchedulerValidationSchema = z.infer<typeof schema>

export default schema
