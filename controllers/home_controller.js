const Post = require('../models/post');
const User= require('../models/user');

/* This is the old homeController that is not taking the popultate function of mongoose into account. I have explained in detail about this comparision in the node.js docx file. Read it there.
module.exports.home=function(req,res){
    var ans;
     Post.find({},function(err, result){   //All callbacks async, and 'result' will be delivered, but after the value of ans is assigned. 
        if(err)
        {
            console.log(' post chaiye to shi id daal');
        }
        else if(!result){
            console.log('result null aaya');
        }
        else{
            // console.log(result);
            //  ans=result.content;
        };
        // console.log(result);
            // User.findById(req.user)
            return res.render('home',{      //Since the callbacks are async, we cannot this return statement outside the else statement, or else it will be executed before we even receive the value of 'result'.
               title : 'Home Page',
               user : req.user,
               posts : result   //Remember this data is already present in the data base, so this will always reload even if the user is not logged in.
            });
        }    
    )};
    // return res.render('home',{      //In case the post is not found, we have to display the home page. And in the home.ejs, we have already taken care of the if condition, if the content is undefined, it will not wait, but print the rest pages.
    //     title : 'Kratos',
    //     user : req.user, 
    //     content :  ans    
    // });
*/



/*
//The function below is creating a callback hell, as this fucntion has its own Post.find and that would call its exec, which has its own callback function in case of correct response. And if all goes correct, then we will have the final return method with a render function returning the rendered code.
module.exports.home = function(req, res){
    // console.log('home page me hai' + req.user);
    // console.log(res.local.user);
    // console.log(res.user);
    // console.log(res.local.user);

    Post.find({})
    .populate({path : 'postOwnerId'})       //If singe elemnt is there then we could populate it by 'populate('postOwnerId') method, but here we have multiple layers of reference variable this is why we need to add it like objects.
    .populate({
        path : 'comments',
        populate :{
            path : 'user'
        }
    })
    .exec(function(err,posts){
        if(err){
            console.log(err); 
            return;
        }

        User.find({},function(err, users){        //We are sending the data of all the users to be displayed in the home page. This will be later used as a friend's list that would be used shown in the section next to posts.    
            return res.render('home', {
                title : 'Home Page',
                user : req.user,        //This is the reason why, in the home.ejs file, if we are not using locals.user even then there is no error. The setAuthenticatedUser, is not longer needed, as we are using the locals.user data in the home.ejs, we are using user. But there is a problem we will have to send this over and over agian to all the pages, and locals.user on the other hand is saving it one time and could be used every where. This is why locals.user is better option.
                posts : posts,
                all_users : users
            });
        });

    });
}
*/



module.exports.home = async function(req, res){     //First try reading the above implementation of the home controller function, this will make you understand why this implementation of home method was optimal.

    try{        //This try and catch block is to find any err that would occur in the below code, instead of finging the error individually we found any sort of error at any place and have a common catch block.


        let posts = await Post.find({})     //This will wait, and the syntax is pretty logical. It will find all the posts meeting the general criteria.
        .sort('-createdAt')
        .populate({path : 'postOwnerId'})
        .populate({
            path : 'comments',
            populate :{
                path : 'user'
            },
            populate :{
                path : 'likes'
            }
        }).populate('comments')
        .populate({path :'likes'});




        //We have deleted any call back function, since we do not need any callback, instead this could be done with the help of await functionality.

        let users= await User.find({});      //We have a list of users that will be sent as users. And it will keep on finding the user without going to the next line.
        console.log(posts[0]);
        return res.render('home', {
            title : 'Home Page',
            user : req.user,        //This is the reason why, in the home.ejs file, if we are not using locals.user even then there is no error. The setAuthenticatedUser, is not longer needed, as we are using the locals.user data in the home.ejs, we are using user. But there is a problem we will have to send this over and over agian to all the pages, and locals.user on the other hand is saving it one time and could be used every where. This is why locals.user is better option.
            posts : posts,      //The it will club all the posts in this place and all the users in the line below.
            all_users : users
        });    
    }catch(err){
        console.log(err);
        return;
    }    
}
//This could have been implemented with the help of promises. As promises does the same thing.