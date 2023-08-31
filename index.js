import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import { TodoController, UserController } from './controllers/index.js'
import { loginValidation, registerValidation, todoCreateValidation } from './validation.js'
import CheckAuth from './utils/CheckAuth.js'

mongoose
	.connect('mongodb+srv://admin:rootroot@tododb.ztwhx3o.mongodb.net/ToDoDB?retryWrites=true&w=majority')
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('Error to connect DB', err))

const app = express()
app.use(express.json())
app.use(cors())
// app.use('/uploads', express.static('uploads'))

// TODO add search on todo (for body || title, for date)
// TODO add avatar logic
// TODO add calendar` and date logic
// TODO через библиотеку js-cookies передавать id пользователей и id todo, и сверять пользователя и принадлежность todo именно ему
// А то заполучив todoId другого пользователя его можно удалить (теоретически)

// Authenticate
app.get('/auth/me', CheckAuth, UserController.getMe)
app.post('/auth/login', loginValidation, UserController.login)
app.post('/auth/register', registerValidation, UserController.register)

// Todos
app.get('/:userId', CheckAuth, TodoController.getAll)
app.get('/todo/:id', CheckAuth, TodoController.getOne)
app.post('/todo/create', CheckAuth, todoCreateValidation, TodoController.create)
app.patch('/todo/:id', CheckAuth, todoCreateValidation, TodoController.update)
app.delete('/todo/:id', CheckAuth, TodoController.remove)

app.listen(4000, (err) => err && console.log(err))
