const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true
    }
    ,
    postOwnerId : {            //The postSchema need to be referred to a real time user, this is we are linking it to the userSchema.
        type : mongoose.Schema.Types.ObjectId,      //This is the data type that is being stored in it. I think this would be reference to this type.
        ref : 'User'        //I got an error when I used 'user' it should be 'User' as 'User' is being exported from the DB, and User will be of.
        // required : true
    },
    postOwnerName : {       //I am not deleting this field, but storing the postOwnerName is not good practice. This will only store the Owner name at the time of post creation, but when the user updates his profile with his new name, this will still be there. This is why it is prefereabble to use the postOwnerId.name as the best practice. Instead when we use the postOwnerId to populate the data, then we could have instead used the postOwnerId.name instead as it will consist of updated name.
        type : String,
        required : true
    },
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comment'
        }
    ],
    likes: [            //This field will obviously consist of all the users that have put in the likes on that particular post. This will make the access of the list of likes easier. And this is exactly how the dynamic programming, using up some space would save a lot of computing time, since the server is always too busy, and if the user that had put likes on the post or the comment had to be fetched every time we load new post, then this would be disatrous.
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},{
    timestamps : true
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;