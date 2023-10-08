import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import { TodoController, UserController } from './controllers/index.js'
import { loginValidation, registerValidation, todoCreateValidation, updateUserValidation } from './validation.js'
import CheckAuth from './utils/CheckAuth.js'
import { upload } from './controllers/filesController.js'

mongoose
	.connect('mongodb+srv://admin:rootroot@tododb.ztwhx3o.mongodb.net/ToDoDB?retryWrites=true&w=majority')
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('Error to connect DB', err))

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// TODO add calendar` and date logic
// TODO через библиотеку js-cookies передавать id пользователей и id todo, и сверять пользователя и принадлежность todo именно ему
// А то заполучив todoId другого пользователя его можно удалить (теоретически)

// Authenticate
app.get('/auth/me', CheckAuth, UserController.getMe)
app.post('/auth/login', loginValidation, UserController.login)
app.post('/auth/register', registerValidation, UserController.register)
app.patch('/user/:id', CheckAuth, upload.single('avatar'), updateUserValidation, UserController.updateSome)

// Todos
app.get('/:userId', CheckAuth, TodoController.getAll)
app.get('/todo/:id', CheckAuth, TodoController.getOne)
app.post('/todo/create', CheckAuth, todoCreateValidation, TodoController.create)
app.patch('/todo/:id', CheckAuth, todoCreateValidation, TodoController.update)
app.delete('/todo/:id', CheckAuth, TodoController.remove)

app.listen(4000, (err) => err && console.log(err))
