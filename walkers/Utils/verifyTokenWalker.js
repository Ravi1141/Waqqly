const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
	try {
		// fetching the user from jwt token 
		const token = req.cookies.auth_token_walker;
		if (!token) {
			return res.status(401).send({ error: "Please login before proceeding" });
		}

		// Verify and decode the token
		const data = jwt.verify(token, process.env.JWT_SECRET);
		req.walker = data.user;
		next();
	} catch (error) {
		res.status(401).end(error.message);
	}
};

module.exports = verifyToken;