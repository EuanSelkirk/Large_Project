import express from 'express';     
import bcrypt from 'bcrypt';       
import User from '../models/User.js'; 

const router = express.Router();   

router.post('/login', async (req, res) => { 
    let error = ''; 

    const { login, password } = req.body;

    let id = -1;       
    let firstName = ''; 
    let lastName = '';   

    try {
        const user = await User.findOne({ login: login.toLowerCase() });

        if (!user) {
            error = 'Invalid user name/password';
        } else {
            // Compare the provided password with the hashed password stored in the database
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                id = user._id;
                firstName = user.firstName;
                lastName = user.lastName;
            } else {
                error = 'Invalid user name/password';
            }
        }
    } catch (err) {
        console.error('Login error:', err);
        error = 'Server error during login process.';
        return res.status(500).json({ id: -1, firstName: '', lastName: '', error: error });
    }

    const ret = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        error: error
    };
    res.status(200).json(ret);
});

export default router;
