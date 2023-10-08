import { validationResult } from 'express-validator'
import TodoModel from '../models/Todo.js'

export const create = async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.errors[0].msg)
		}

		const doc = new TodoModel({
			user: req.userId,
			body: req.body.body,
			title: req.body.title,
			completed: req.completed || 0,
		})

		const todo = await doc.save()

		res.status(200).json(todo)
	} catch (error) {
		console.log(error)
		res.status(400).json('Не удалось создать заметку')
	}
}

export const getAll = async (req, res) => {
	try {
		const todos = await TodoModel.find({ user: `${req.params.userId}` })
		res.status(200).json(todos)
	} catch (err) {
		console.log(err)
		res.status(400).json({ message: 'Не удалось получить заметки' })
	}
}

export const getOne = async (req, res) => {
	try {
		const todoId = req.params.id
		const todos = await TodoModel.findOne({ _id: todoId }).exec()
		res.status(200).json({ todos })
	} catch (error) {
		console.log(error)
		res.status(400).json({ message: 'Не удалось получить заметку' })
	}
}

export const remove = async (req, res) => {
	try {
		const todoId = req.params.id
		await TodoModel.findOneAndDelete({ _id: todoId }).then((doc) => {
			if (!doc) {
				return res.status(400).json({ message: 'Не удалось найти заметку' })
			}
			res.status(200).json({ message: 'Success' })
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: 'Не удалось получить заметку' })
	}
}

export const update = async (req, res) => {
	if (!Object.keys(req.body).length) return res.status(404).json('Server not get info')
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array())
	}

	try {
		const todoId = req.params.id
		await TodoModel.updateOne(
			{ _id: todoId },
			{
				user: req.userId,
				title: req.body.title,
				body: req.body.body,
				completed: req.body.completed || 0,
			}
		)
		res.json({ message: 'Success' })
	} catch (err) {
		console.log(err)
		res.status(400).json({ message: 'Не удалось получить заметку' })
	}
}
