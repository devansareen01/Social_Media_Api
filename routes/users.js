
const User = require('../models/User');
const router = require('express').Router();
const bcrypt = require('bcrypt');

//update a user
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                return res.status(500).json(error);
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });

            if (!user) {
                return res.status(404).json("User not found");
            }


            res.status(200).json("Account has been updated")

        } catch (error) {
            return res.status(500).json(error);

        }
    } else {
        return res.status(403).json("You can update only your account")
    }
})
//delete a user

router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {


        try {
            const user = await User.findByIdAndDelete(req.params.id);

            res.status(200).json("Account has been Deleted")

        } catch (error) {
            return res.status(500).json(error);

        }
    } else {
        return res.status(403).json("You can delete only your account")
    }
})
//get a user

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        // ._doc contain all objects of user and by array destructuring we can hide password and updatedAt details
        const { password, updatedAt, ...other } = user._doc;
        return res.status(200).json(other);
    } catch (error) {
        return res.status(500).json(error);
    }
})
// follow a user
router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("You had already followed this user");
            }

        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("you cannot follow yourself");
    }
})
// unfollow a user

router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("You have not followed already");
            }

        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("you cannot unfollow yourself");
    }
})





module.exports = router; 