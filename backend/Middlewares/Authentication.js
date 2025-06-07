const jwt = require('jsonwebtoken');

const ensureAuthenticated = (roles = []) => {
    return (req, res, next) => {
        const auth = req.headers['authorization'];
        if (!auth) {
            return res.status(403)
                .json({ message: 'Unauthorized, Login and retry', success: false });
        }
        try {
            const decoded = jwt.verify(auth, process.env.JWT_SECRET);
            req.user = decoded; 
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403)
                    .json({ message: 'Unauthorized Role Access', success: false });
            }

            next();
        } catch (err) {
            console.log(err);
            return res.status(403)
                .json({ message: 'Login Failed! Try Again', success: false });
        }
    };
};

module.exports = ensureAuthenticated;