const jwt = require('jsonwebtoken');

/**
 * helper function to authenticate every database request 
 * a valid user with a valid token 
 */
const ensureAuthenticated = (roles = []) => {
    return (req, res, next) => {
        const auth = req.headers['authorization'];
        if (!auth) {
            return res.status(403)
                .json({ message: 'Unauthorized, Login and retry', success: false });
        }
        try {
            const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; 
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403)
                    .json({ message: 'Unauthorized Role Access', success: false });
            }

            next();
        } catch (err) {
            console.log(err);
            return res.status(403)
                .json({ message: 'Login Expired ! Login Again', success: false });
        }
    };
};

module.exports = ensureAuthenticated;