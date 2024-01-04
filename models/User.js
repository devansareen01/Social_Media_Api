const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 3,// min character
        max: 20,// max character
        unique: true
    },
    email: {
        type: String,
        require: true,
        max: 50,// max character
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 6
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        defualt: []
    },
    followings: {
        type: Array,
        defualt: []
    },
    isAdmin: {
        type: Boolean,
        defualt: false

    }

},
    {
        timestamps: true
    });


module.exports = mongoose.model("User", UserSchema)