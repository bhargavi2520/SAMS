const { User } = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const registerUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, aparId, admissionDate, currentYear, semester, department, transport, address, parentPhone, parentEmail, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists', success: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            aparId,
            admissionDate,
            currentYear,
            semester,
            department,
            transport,
            address,
            parentPhone,
            role
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'User not found', success: false });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password', success: false });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        })

        res.status(200).json({
            message: 'Login successful',
            succes: true,
            userInfo: {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            }, token
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    registerUser,
    loginUser
};
