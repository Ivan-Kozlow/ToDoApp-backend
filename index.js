import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import { TodoController, UserController } from './controllers/index.js'
import {
	loginValidation,
	registerValidation,
	todoCreateValidation,
	updateUserValidation,
	todoUpdateValidation,
} from './validation.js'
import CheckAuth from './utils/CheckAuth.js'
import { upload } from './controllers/filesController.js'

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('Error to connect DB', err))

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// Authenticate
app.get('/auth/me', CheckAuth, UserController.getMe)
app.post('/auth/login', loginValidation, UserController.login)
app.post('/auth/register', registerValidation, UserController.register)
app.patch('/user/:id', CheckAuth, upload.single('avatar'), updateUserValidation, UserController.updateSome)

// Todos
app.get('/:userId', CheckAuth, TodoController.getAll)
app.get('/todo/:id', CheckAuth, TodoController.getOne)
app.post('/todo/create', CheckAuth, todoCreateValidation, TodoController.create)
app.patch('/todo/:id', CheckAuth, todoUpdateValidation, TodoController.update)
app.delete('/todo/:id', CheckAuth, TodoController.remove)

app.listen(process.env.PORT || 4000, (err) => err && console.log(err))
