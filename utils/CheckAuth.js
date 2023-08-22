import jwt from 'jsonwebtoken'

export default (req, res, next) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
	if (token) {
		try {
			const decoded = jwt.verify(token, 'jwt-token')
			req.userId = decoded._id
			next()
		} catch (error) {
			console.log(error)
			res.status(401).json({ massage: 'Нет доступа' })
		}
	} else {
		return res.status(403).json({ message: 'Нет доступа' })
	}
}
