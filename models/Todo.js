import mongoose from 'mongoose'

const TodoScheme = new mongoose.Schema(
	{
		title: { type: String, required: true },
		completed: { type: Number },
		body: { type: String },
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
)

export default mongoose.model('Todo', TodoScheme)
