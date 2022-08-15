const Comment = require('../models/comment');
const Post = require('../models/post');
// const commentsMailer = require('../mailers/comments_mailer');        //Keeping this line commented will not create any effect, since newComment method is not being called in this module anyway.
const commentEmailWorker = require('../workers/comment_email_worker');      //But we will have to include this file, even if we are not using this method anywhere, plus the file that is mentioned in here, is not even exporting anything, so commentEmailWorker will not contain anything. But queue.process is about defining what content will go into the queue, and for that to be accessible here, we need to require it.
const queue = require('../config/kue');
const Like = require('../models/like');


module.exports.comment =  function (req,res){
    Post.findById(req.body.postId, function(err, post){     //Since there would be a lot of posts that would be in the db, so we first need to find it by the postId and then we need to push the comment that we have newly created into the comments array.
        if(err){console.log(err);return;}    
        if(post){
            Comment.create({
                content : req.body.comment,
                user : req.user._id,        //We need to keep the userId that posted the comment.
                post : req.body.postId      //We need to keep track of postId on which the comment has been made.
            }, async function(err,comment){
                if(err){console.log(err);return;}    
                    post.comments.push(comment);
                    post.save();            //Whenever we are updating any thing, we need to save it. This method tells the database that for now this is the final version, and we need to block it.
                    comment = await comment.populate('user', 'name email');     //Earlier in the codeial code, .execPopulate() method was present, which has to be removed, since it is deprecated.
                    console.log(comment);
                    // commentsMailer.newComment(comment);      //This comment was being sent through the mails, using the main thread only, but in this case, we want to replace it with the workers queue. So that the main thread will not be blocked.
                    let job= queue.create('emails', comment).save(function(err){       //The name is kept as job, because every task we put in the queue, will be a job. Also if you notice in this line, the queue.create method will first create the queue with worker name as 'emails' then in the file queue.process, this will send this information and the information would call the email module, so basically the queue is being generated every time a new comment is added, it will go through queue. 
                        if(err){
                            console.log('error in creating a queue', err);
                            return ;

                        }
                        console.log(job.id);        //In the above function, after the save function is called, the job.id is avaialble to us. This is why we are able to access the job.id inside it, or else we could have only been able to access it outside the queueMicrotask.create() method.
                    });
                    req.flash('success', 'Comment published!');
                return res.redirect('/');
            });
        }
    });    
};



module.exports.deleteComment = function (req,res){
    //We are sending the params, and in those params we will
    Comment.findById(req.params.commentId,function(err, comment){
        if(err){console.log(err);return;}
        if(comment.user == req.user.id){
            const postId=comment.post;
            comment.remove();       //This will remove the comment object that is received as Id reference. By simply backtracking.
            Post.findByIdAndUpdate(postId, {$pull : {comments :req.params.commentId}}, async function(err, post){
                //We also have to delete the comment reference in the post, and this is not a mongoose method, this is simple and plain mongo method that will only delete the reference from the commetns array in the post object.

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

                if(err){console.log(err);return;}    
                console.log('Comments deleted');
                return res.redirect('/');
            });
        }
        else{
            return res.redirect('/');
        }
    });
};