import multer from 'multer'
import fs from 'fs'

// uploads
const storage = multer.diskStorage({
	// Path file`s
	destination: (_, file, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads')
		}
		cb(null, 'uploads')
	},
	// Save file with origName
	filename: (_, file, cb) => {
		cb(null, new Date().getTime() + '-' + file.originalname)
	},
})

export const upload = multer({ storage })
