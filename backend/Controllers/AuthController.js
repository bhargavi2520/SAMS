const { User, Student, Admin, Faculty, HOD, ClassCoordinator } = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const registerUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, role, ...roleSpecificData } = req.body;

        const roleModels = {
            'Student': Student,
            'Admin': Admin,
            'Faculty': Faculty,
            'HOD': HOD,
            'ClassCordinator': ClassCoordinator
        };

        const UserModel = roleModels[role];
        if (!UserModel) {
            return res.status(400).json({ message: 'Invalid role specified', success: false });
        }



        const existingUser = await User.findOne({ $or: [{ email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists', success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            role,
            ...roleSpecificData
        };

        const newUser = new UserModel(userData);
        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            success: true
        });

    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0];
            let message = `User with this ${duplicateField} already exists`;
            return res.status(400).json({ message, success: false });
        }
        res.status(500).json({ message: 'Internal server error', success: false });
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
                role: user.role,
                Id: user.Id
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
