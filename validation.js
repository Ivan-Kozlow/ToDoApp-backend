import { body } from 'express-validator'

// =============== User ==============
export const registerValidation = [
	body('email', 'Проверьте корректность почты').isEmail(),
	body('password', 'Пароль меньше 8 символов').isLength({ min: 8 }),
	body('nickname', 'Имя должно быть от 2 до 20 символов').isLength({ min: 2, max: 20 }),
	body('avatar').optional(),
]

export const loginValidation = [
	body('email', 'Проверьте корректность веденной почты').isEmail(),
	body('password', 'Пароль меньше 8 символов').isLength({ min: 8 }),
]

export const updateUserValidation = [
	body('email', 'Проверьте корректность почты').optional({ checkFalsy: true }).isEmail(),
	body('password', 'Пароль меньше 8 символов').optional({ checkFalsy: true }).isLength({ min: 8 }),
	body('nickname', 'Имя должно быть от 2 до 20 символов').optional({ checkFalsy: true }).isLength({ min: 2, max: 20 }),
	body('avatar').optional(),
]

// =============== Todo ==============
export const todoCreateValidation = [
	body('title', 'Слишком короткий заголовок').isString().isLength({ min: 3 }),
	body('body', 'Введите текст заметки').optional({ checkFalsy: true }).isString().isLength({ min: 2 }),
	body('completed', 'Неверные значения прогресса').optional({ checkFalsy: true }).isInt({ min: 0, max: 2 }),
]
