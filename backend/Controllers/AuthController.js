const { User } = require('../Models/User');
const bcrypt = require('bcryptjs');


const registerUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, aparId, admissionDate, currentYear, semester, department, transport, address, parentPhone, parentEmail, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
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


module.exports = { registerUser };
