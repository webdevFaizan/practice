const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

// module.exports.sendposttodb= function(req,res){
//     if(!req.user)       //I tried to use the req.locals.user, but this did not work. As in the req object there is no locals variable. In the setAuthenticated user controller, we have used res.locals.user=req.user, I think this user  is sent with each and every end point we hit, since it is available in each and every method out there.
//     {
//         console.log('Login krke aa pehle...');
//         return res.redirect('back');
//     }
//     console.log('abhi post krke db me daale hai');
//     Post.create({
//         content : req.body.content,
//         postOwnerId : req.user._id,
//         postOwnerName : req.user.name
//     },function(err,task){           //This code is having only one level of callback and there is no scenario of callback hell, this is why we will not convert this code to the async and await structure. Although this could be done very easily.
//     if(err){console.log(err); return;}
//     req.flash('success','Posted, will be live in a few Seconds.');
//     return res.redirect('/');
//     });
// }


//2nd version of the sendposttodb method. Upgraded to the latest asynchronous methods.
// module.exports.sendposttodb= async function(req,res){
//             try{
//                 if(!req.user)
//                 {
//                     console.log('Login krke aa pehle...');
//                     return res.redirect('back');
//                 }
//                 console.log('abhi post krke db me daale hai');
//                 let post = await Post.create({
//                     content : req.body.content,
//                     postOwnerId : req.user._id,
//                     postOwnerName : req.user.name
//                 }); 

//                 if (req.xhr){
//                     return res.status(200).json({
//                         data: {
//                             post: post
//                         },
//                         message: "Post created!"
//                     });
//                 }
//                 req.flash('success','Posted, will be live in a few Seconds.');                
//                 return res.redirect('back');
//             }
//             catch(err){
//                 req.flash('error', err);
//                 console.log(err); return;
//             }
//     };


//3rd version of the sendposttodb method. Upgraded to the latest asynchronous methods.
module.exports.sendposttodb = async function(req, res){
    try{
        let post = await Post.create({
            content : req.body.content,
            postOwnerId : req.user._id,
            postOwnerName : req.user.name
        });
        // console.log(post);
        if (req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it! This line I copied from codial, but I could not understand this, and not using this line will not create any error.
            // post = await post.populate('user', 'postOwnerName').execPopulate();
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
            // console.log('dsfsd');
        }
        req.flash('success', 'Post published!');
        return res.redirect('back');
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }  
};


//1st version of the deletePost method. Not using the AJAX call
//This code could be transformed to async and await, since this code is having two layers of callbacks. And one need to be called after the other has been properly executed. This is the exact scenario where the async and await works.
// module.exports.deletePost = function(req,res){
//     // console.log(req.params.postId);
//     // console.log('Inside the delete post');
//     Post.findById(req.params.postId, function(err,post){
//         if(err){
//             console.log(err);
//             req.flash('error','Some error occured.');
//             return;
//         }
//         //Note here, we are not taking req.user._id as this would be an Object. But instead we will be taking req.user.id, as this would be the string version of the id. And we want string to be compared with the help of ==
//         if(post.postOwnerId==req.user.id){       //If we use locals here, it will not be defined, since locals are only defined for the views so basically we could only use it for ejs files.
//             post.remove();
//             Comment.deleteMany({user : req.params.postId}, function(err){
//                 if(err){console.log(err);return;}
//                 // return res.redirect('/');
//             });
//             console.log('Post delete kr diye be.');
//         }else{
//             // console.log('The post does not exist');
//             req.flash('error','Post could not be deleted, some error occured.');
//         }
//         req.flash('success','Post deleted.');       //This message is inside the callback hell, it is not being passed to the res.locals.flash, so this will never be displayed as a pop up message, I have researched about it, just find "JavaScript Callbacks Variable Scope Problem" topic in node.docs file and you will get the answer.
//         return res.redirect('back');
//     });
//     // req.flash('success','Post deleted.');            //This will show the pop up message as it will go to the global res.locals.flash, I have explained this problem in a great detail in the "JavaScript Callbacks Variable Scope Problem".
//     console.log('Post not found');
//     // return res.redirect('back');
// }



//2nd version of the deletePost method. It is using the AJAX call.
module.exports.deletePost = async function(req,res){
    const post =await Post.findById(req.params.postId);
    if(post.postOwnerId==req.user.id){   
        
        
        // CHANGE :: delete the associated likes for the post and all its comments' likes too
        await Like.deleteMany({likeable: post, onModel: 'Post'});       //This would have made the simple query by, requiring the post with a specific id and also keeping the onModel as Post just to keep a check that the data that is being deleted is from a 'post' only.
        await Like.deleteMany({_id: {$in: post.comments}});     //This is just a short way of writing, but I could have used the traditional way of writing the input command and that would have done the exact same thing.

        //Before removing the post, we are going to delete the like on the post and the likes of the comments of the post. And the jquery method of using $ to select the post.comments will be very useful in this situation. As we could easily select the likes of this post and then delete it.

        post.remove();

        //After deleting the post we will delete the associated comment with it.
        await Comment.deleteMany({post : req.params.postId});
        console.log('Post delete kr diye be.');
        if (req.xhr){
            return res.status(200).json({
                data: {
                    post_id: req.params.postId
                },
                message: "Post deleted"
            });
        }
        req.flash('success','Post deleted.');
    }else{
        req.flash('error','Post could not be deleted, some error occured.');
    }
    return res.redirect('back');
}



module.exports.showpost= function(req,res){
    
}







