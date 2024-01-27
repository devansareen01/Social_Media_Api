const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

// create a post
router.post('/', async (req, res) => {
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        res.status(200).json(newPost)
    } catch (error) {
        res.status(500).json(error);
    }
})
//update a post

router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json("Post not found");
        }

        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("Post has been updated");
        } else {
            res.status(403).json("You can only update your posts");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//delete a post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json("Post not found");
        }

        if (post.userId === req.body.userId) {
            await post.deleteOne({ $set: req.body });
            res.status(200).json("Post has been deleted");
        } else {
            res.status(403).json("You can only delete your posts");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//like a post
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json("Post not found");
        }

        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("The Post has Been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The post has been disliked");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//get a post


router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json("Post not found");
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);

    }
})
// get timeline posts

router.get('/timeline/:userId', async (req, res) => {


    try {
        const currentUser = await User.findById(req.params.userId);

        const userPosts = await Post.find({ userId: currentUser._id });

        const friendsPosts = await Promise.all(
            currentUser.followings.map(async (friendId) => {
                try {
                    return await Post.find({ userId: friendId });
                } catch (error) {
                    console.error(error);
                    throw error; // Rethrow the error to be caught by the outer catch block
                }
            })
        );

        res.json(userPosts.concat(...friendsPosts))
    } catch (error) {

        res.status(500).json(error);
    }
})

// get user's all post

router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;