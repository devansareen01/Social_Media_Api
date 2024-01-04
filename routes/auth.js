const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register
router.post('/register', async (req, res) => {
    try {

        //encrypting password using bcrypt library 
        const salt = await bcrypt.genSalt(10);
        // salt is used to determines complexity of hasing it is secure but may take longer to compute that's why await keyword is used
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // creating new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        // saving user and returinng response
        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json(error);

    }
})


//Login

router.post('/login', async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).send("User not found");
        }

        // we will use bcrypt compare function to compare password 
        // etihter dcrypting it 
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).send("Wrong password")
        }


        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;
