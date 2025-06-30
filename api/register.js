import jwt from 'jsonwebtoken';
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../model/users.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    let error = '';
    const { username, password, email } = req.body;
    let id = -1;
    let token = '';

    try {
        const login = username.toLowerCase();
        
        let user = await User.findOne({ login });
        if (user) {
            error = 'User with this login already exists.';
            return res.status(409).json({ id: -1, email: '', error: error });
        }

        user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            error = 'User with this email already exists.';
            return res.status(409).json({ id: -1, email: '', error: error });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        user = new User({
            username: username.toLowerCase(),
            password: hashedPass,
            email: email.toLowerCase(),
        });

        await user.save();

        id = user._id;

        token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

    } catch (err) {
        console.error('Registration error:', err);
        error = 'Server error during registration.';
        if (err.name === 'ValidationError') {
            error = `Validation error: ${err.message}`;
        }
        return res.status(500).json({ id: -1, email: '', token: '',error: error });
    }

    res.status(201).json({
        id,
        email,
        token,
        error
    });
});

export default router;
