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
			return res.status(404).json({ message: 'Неверный логин или пароль' })
		}

		const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)
		if (!isValidPassword) {
			return res.status(404).json({ message: 'Неверный логин или пароль' })
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
			// avatarUrl: req.body.avatar,
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
			res.status(400).json({ message: 'Отказано в доступе' })
		}

		const { passwordHash, ...userData } = user._doc
		res.status(200).json(userData)
	} catch (error) {
		console.log(error)
		res.status(401).json({ message: 'Нед доступа' })
	}
}
