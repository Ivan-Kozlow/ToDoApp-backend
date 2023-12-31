import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		nickname: { type: String, required: true },
		passwordHash: { type: String, required: true },
		avatar: { type: String },
	},
	{ timestamps: true }
)

export default mongoose.model('User', UserSchema)
