const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
	try {
		// fetching the user from jwt token 
		const token = req.cookies.auth_token_user;
		if (!token) {
			return res.status(401).send({ error: "Please login before proceeding" });
		}

		// Verify and decode the token
		const data = jwt.verify(token, process.env.JWT_SECRET);
		req.user = data.user;
		console.log(req.user); 
		next();
	} catch (error) {
		res.status(401).send({"message": "error"});
	}
};

module.exports = verifyToken;