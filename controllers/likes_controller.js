const Like = require("../models/like");
const Post =  require("../models/post");
const Comment = require('../models/comment');


//We are not creating any function that is simply having either delete comment/post or add comment/post only, instead we are having a toggle switch, if like exists then remove it, or it does not exist then create it.
module.exports.toggleLike = async function(req, res){   
    console.log('toggleLike me hai');
    try{
        // likes/toggle/?id=abcdef&type=Post

        let likeable;       //This is going to be the parent of like which contain, where the like was present, whether on post or comment.
        let deleted = false;        //This variable will keep the data of whether we are deleting the like or creating the like object. This would be helpful for the front end part of the website, where we could know whether to show the data or not show the data. AND HONESTLY, THIS IS VERY IMPORTANT PART OF THIS METHOD. We do not want the user to know whether the data of like is being saved on database or not, we just want them to know that the post/comment is being added/delted, so this is the only variable that will be sent in the res.json object.

        if (req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');     //Here populate method will simply populate the likes field in the model, which simply means that list of users and its data that have liked the post will be populated here.
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // This one finds the list of like from a data base that consists of all the likes. But out of all the crowded likes, we will have only unique like, while having a query with the help of three query fields. The likes must have user id and the post/comment from which the like has to be removed. And one thing we might feel, this is the general data bases of all the likes on the whole of social media, so querying it must be a tiresome job, as it will be the largest of all the data base we have created in our project, but the id is unique, and will be searched only using the hashing technique, this simply means that it will take O(1) and it is a good practice to keep more than one data base, a post must consist of an array of users that has liked the post, while a likes database must also consist of all the users that have liked the post or comment anywhere on the whole website. And then we must join these both data bases, based on the model, this is simply because a two way relationship would be better for the cross checking as well as the we will be able to access the likes data from both ways. And also by keeping the database of likes separate, if we want to know all the likes history of one particular user, we could do it, this could help us in finding the useful insights about that particular user, about the type of content he likes. This data could be useful for the insight using big data and machine learning. Also if the user is indugled into some terror related post, and he is red flagged, we will be able to find all the posts he was engaging on. This simply means we will can know all their history. By one simple query.
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })
        
        // if a like already exists then delete it
        if (existingLike){
            // We are updating two different databases regarding the likes, delete the like object from the post/comment
            likeable.likes.pull(existingLike._id);      //The pull method deletes the array element data from the database.
            likeable.save();        //Unless you use the save method() the changes in the data base will not be reflected back into the data base.

            existingLike.remove();      //But the question is why was the same existingLike.save() method not called here? Is it because this is not an array element but rather an object.
            deleted = true;
        }else{
            // else make a new like, this is the part of toggle, since the like will be added if the like was not present.
            let newLike = await Like.create({
                user: req.user._id,         //This is about which user is liking the post.
                likeable: req.query.id,     //And this is about on which thing the like is being made. And the coolest part about this is that it will be dyncamically defined whether it is post or comment. We are sending the id of the post or comment through query in the route. And use that to create the likes.
                onModel: req.query.type     //This is any extra feature to keep whether the model is of post or comments. If the comments is being liked then this will be saved here.
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.status(200).json({
            message: "Request successful!",
            data: {
                deleted: deleted        //This response text is simply sending the data of whether the data is being deleted or not.
            }
        })

    }catch(err){
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}