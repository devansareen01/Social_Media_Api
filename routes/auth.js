const router = require('express').Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;
