import { body } from 'express-validator'

export const registerValidation = [
	body('email', 'Аккаунт с такой почтой уже существует').isLength({ min: 9 }).isEmail(),
	body('password', 'Пароль меньше 8 символов').isLength({ min: 8 }),
	body('nickname', 'Имя слишком короткое').isLength({ min: 2 }),
	// body('avatarUrl').optional().isURL(),
]

export const loginValidation = [
	body('email', 'Проверьте корректность веденной почты').isLength({ min: 9 }).isEmail(),
	body('password', 'Пароль меньше 8 символов').isLength({ min: 8 }),
]

export const todoCreateValidation = [
	body('title', 'Слишком короткий заголовок').isString().isLength({ min: 3 }),
	body('body', 'Введите текст заметки').optional().isString().isLength({ min: 2 }),
	body('completed', 'Неверные значения прогресса').optional().isInt({ min: 0, max: 2 }),
]
