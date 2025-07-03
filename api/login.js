import jwt from 'jsonwebtoken';
import express from 'express';     
import bcrypt from 'bcrypt';       
import User from '../model/users.js'; 

const router = express.Router();   

router.post('/login', async (req, res) => { 
    const { login, password } = req.body;
    let error = ''; 
    let id = '';       
    let username = '';
    let token = '';

    try {
        const user = await User.findOne({ username: login.toLowerCase() });

        if (!user) {
            return res.status(401).json({
                id: '',
                username: '',
                token: '',
                error: 'Invalid username or password'
            });
        } 
        else {
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
                 return res.status(401).json({
                    id: '',
                    username: '',
                    token: '',
                    error: 'Invalid username or password'
                });
            }
        }
    } 
    catch (err) {
        console.error('Login error:', err);
        error = 'Server error during login process.';
        return res.status(500).json({ id: '', username: '', token: '', error: error });
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
