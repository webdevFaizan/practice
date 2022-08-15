const User = require('../models/user');
const fs = require('fs');       //Since we are going to delete the avatar image, as we are going to give the user an option to replace the existing avatar, so the old one needs to be deleted.
const path = require('path');       //This will help us access the path at which the fs module is kept, the file that is kept at a certain place must be selected before deletion.


module.exports.user=function(req,res){
    // return res.send('<h1>User Profile</h1>');
    return res.render('user_profile',{
        title : 'Kratos'
    });
};

module.exports.personalData=function(req,res){
    
        return res.render('personal_user_profile',{
            title : 'abcd',
            // email : req.email
            user  : req.user
        });
    
    // return res.send('<h1>User Profile</h1>');
};


module.exports.data=function(req,res){
    User.findById(req.params.userId, function(err, u){
        if(err){console.log(err); return;}
        return res.render('user_profile',{
            title : 'abcd',
            // email : req.email
            user_details : u        //The variable name 'user' is not used here since there is a different variable with that name, the logged in user is the one that is having that name.
        });
    });
    // return res.send('<h1>User Profile</h1>');
};



module.exports.update=function(req,res){
    return res.render('update_personal_page',{
        title : 'Update User Information'
    })
}

// module.exports.submitUpdateForm = function(req,res){
//     // if(req.user.id == user)
//     User.findByIdAndUpdate(req.user.id,{name : req.body.name, email : req.body.email}, function(err, u){
//         console.log(u + 'updated');
//         return res.redirect('/user/data/self');
//     });
// }


module.exports.submitUpdateForm = async function(req,res){        //This update form is being created after we have added the feature of avatar in the whole website, now 
            //We are not checking whether wrong user will be able to access this method or not, since if we came to this method it was only when the user is genuinely trying to change this, since we have already checked for authentication in the middle ware that is accessing this page.
        try{
            let user = await User.findById(req.user.id);        //There is one confusion though, this command is only finding the user by its id, not updating it, so how do we make sure the data is updated? I got the answer, user.save() method in the method below is going to update the document. So the finding part could now be separate as well as the updating part could also be separate.
            //Now there is one thing here, the body parser cannot directly access the content of the form that is being submitted. Since the enctype of the form is multi from and this is not like general form that consists of only string and integer based data.  This is exactly where the statics.uploadedAvatar method will be properly used.
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('********Multer error '+err);
                }
                // console.log(req.file);       //If we uploaded a file, it will be avaiable in the req object.
                user.name = req.body.name;          //We would have not been able to read the name and email field since this is the multipart form and not the general form, this is how we read through the multi part form. In the multipart form the name of the user and content of photo and videos will be accessible in a different manner.
                user.email = req.body.email;        //Once we submit the form, this data will be transmitted as req.body.
                if(req.file){

                    if(user.avatar){        //This check if in the new form that we are submitting, whether there is any user.avatar present or not. If there is no user avatar this will not be executed.
                        try{        //if the form contains any new avatar to replace the old one. This try catch block will ensure that there is no other error.
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));     //If the path name in the user.avatar exist, but some hacker has deleted the database, and if we use this method to delete a file that has a path name but the actual file is missing, then in that case, this method will give an error. It will work fine if the path name of the user.avatar and the file is actually present at the designated location, but if it is not then this try catch block will not let the whole website crash. And after this if condition, the path of user.avatar will be updated. And there will be only one current file for one current avatar. Along with its value of the path in the user.avatar
                        }
                        catch(err){
                            console.log('wrong path name');
                        }
                    }

                    user.avatar = User.avatarPath+'/'+req.file.filename;        //This is the value of avatar variable, that will be used to save(as a path), and since this is not required in models, the value of avatar will always not be avaialble, only when user updates it avatar then it will be available, this also means, we could update the details of user or add additional profile field even after creating the later version of website. This is simply because, we have not kept this field as compulsory.
                }
                user.save();            
                return res.redirect('back');
            });
            // console.log(user.name);
            // console.log(user.email);
        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }