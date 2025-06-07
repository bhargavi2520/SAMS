const express = require('express');
const AuthRouter = express.Router();
const { registerValidation } = require('../Middlewares/AuthValidation.js');
const { registerUser } = require('../Controllers/AuthController.js');


AuthRouter.get('/', (req, res) => {
    res.send('It is the Auth Router !');
});

AuthRouter.post('/login', (req, res) => {
    const { usrname, password } = req.body;
    if (!usrname || !password) {
        return res.status(400).json({
            message: 'Username and password are required',
        });
    }
    res.json({
        message: 'Login successful',
    });
})

AuthRouter.post('/register', registerValidation, registerUser);


module.exports = AuthRouter;