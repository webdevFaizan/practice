const mongoose = require('mongoose');

//This comment schema could be easily used to create a db of its own. But this comment db on its own will be of no use. This schema could be used best to add in the array of comments linked to the post link.

const commentSchema = mongoose.Schema({
    content : {
        type : String,
        required : true
    }, 
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post'
    },
    likes: [            //This field will obviously consist of all the users that have put in the likes on that particular comment.
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},{
    timestamps : true
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;