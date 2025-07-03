import jwt from 'jsonwebtoken';
import express from 'express';     
import bcrypt from 'bcrypt';       
import User from '../model/users.js'; 

const router = express.Router();   

router.post('/login', async (req, res) => { 
    let error = ''; 
    const { login, password } = req.body;

    let id = -1;       
    let username = '';
    let token = '';

    try {
        const user = await User.findOne({ login: login.toLowerCase() });

        if (!user) {
            error = 'Invalid user name/password';
        } else {
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                id = user._id;
                username = user.username;

                token = jwt.sign(
                    { userId: user._id, username: user.username },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                )
            } else {
                error = 'Invalid user name/password';
            }
        }
    } catch (err) {
        console.error('Login error:', err);
        error = 'Server error during login process.';
        return res.status(500).json({ id: -1, username: '', token: '', error: error });
    }

    const ret = {
        id,
        username,
        token,
        error
    };
    
    res.status(200).json(ret);
});

export default router;
