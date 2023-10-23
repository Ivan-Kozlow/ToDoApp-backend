import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from '../models/User.js'

export const login = async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.errors[0].msg)
		}
		let user = await UserModel.findOne({ email: req.body.email })
		if (!user) {
			return res.status(401).json({ message: 'Неверный логин или пароль' })
		}

		const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)
		if (!isValidPassword) {
			return res.status(401).json({ message: 'Неверный логин или пароль' })
		}

		// successful login
		const token = jwt.sign({ _id: user._id }, 'jwt-token', { expiresIn: '30d' })
		const { passwordHash, ...userData } = user._doc
		res.json({ ...userData, token })
	} catch (error) {
		console.log(error)
		res.status(403).json({ message: 'Нет такого пользователя' })
	}
}

export const register = async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		//Hashed password
		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new UserModel({
			nickname: req.body.nickname,
			email: req.body.email,
			passwordHash: hash,
			avatar: req?.file?.filename || '',
		})

		const user = await doc.save()
		const token = jwt.sign({ _id: user._id }, 'jwt-token', { expiresIn: '30d' })
		const { passwordHash, ...userData } = user._doc

		res.json({ ...userData, token })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Не удалось зарегистрироваться' })
	}
}

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)
		if (!user) {
			return res.status(400).json({ message: 'Отказано в доступе' })
		}
		const { passwordHash, ...userData } = user._doc
		res.status(200).json(userData)
	} catch (error) {
		console.log(error)
		res.status(401).json({ message: 'Нет доступа' })
	}
}

export const updateSome = async (req, res) => {
	if (!Object.keys(req.body).length && !req.file?.filename)
		return res.status(400).json('Сервер не получил данные, проверьте их корректность')
	const errors = validationResult(req)
	if (!errors.isEmpty()) return res.status(400).json(errors.array())

	try {
		const userId = req.params.id

		let hash
		if (req.body.password) {
			let password = req.body.password
			let salt = await bcrypt.genSalt(10)
			hash = await bcrypt.hash(password, salt)
		}
		const avatarName = req.file?.filename || ''
		await UserModel.updateOne(
			{ _id: userId },
			{
				email: req.body.email,
				nickname: req.body.nickname,
				passwordHash: hash,
				avatar: avatarName,
			}
		)
		res.json('uploads/' + avatarName)
	} catch (error) {
		console.log(error)
		res.status(400).json({ message: 'Не удалось обновить данные' })
	}
}
