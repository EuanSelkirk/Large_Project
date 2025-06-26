// routes/register.js
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    let error = '';
    const { login, password, email } = req.body;
    let id = -1;

    try {
        let user = await User.findOne({ login: login.toLowerCase() });
        if (user) {
            error = 'User with this login already exists.';
            return res.status(409).json({ id: -1, email: '', error: error });
        }

        user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            error = 'User with this email already exists.';
            return res.status(409).json({ id: -1, email: '', error: error });
        }

        user = new User({
            login: login.toLowerCase(),
            password: password,
            email: email.toLowerCase(),
        });

        await user.save();

        id = user._id;

    } catch (err) {
        console.error('Registration error:', err);
        error = 'Server error during registration.';
        if (err.name === 'ValidationError') {
            error = `Validation error: ${err.message}`;
        }
        return res.status(500).json({ id: -1, email: '', error: error });
    }

    const ret = {
        id: id,
        email: email,
        error: error
    };

    res.status(201).json(ret);
});

export default router;
