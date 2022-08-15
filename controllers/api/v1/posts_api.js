const Post = require('../../../models/post');
const Comment = require('../../../models/comment');


module.exports.index = async function(req,res){
    let posts = await Post.find();
    return res.status(200).json({
        message : "API, version 1, All ok, boi",
        posts : posts
    })
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
        if (post.postOwnerId == req.user.id){       //The passport.authentication is the authentication part, but this is the authorization part, here we are checking the viability of user, if the user is the same user that made the post then only allow it to delete.
            post.remove();      //This will delete the post from the database.
            await Comment.deleteMany({post: req.params.id});    
            return res.json(200, {      //Instead of rendering it on the front end side, this will send in the json format object that would be displayed in the api testing tool like postman or thunderclient.
                message: "Post and associated comments deleted successfully!"
            });
        }else{
            // console.log(post.postOwnerId+" and "+ req.user.id);      //I was using these lines to debug, what was the user coming in both cases.
            // console.log(req.params.id);
            return res.status(401).json({
                message: "You cannot delete this post!"
            });
        }
    }catch(err){
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}