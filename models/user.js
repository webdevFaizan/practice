const mongoose= require('mongoose');

const multer = require('multer');       //We are not having a centeralised approach to using multer and we are not using multer in the config folder, since we will be using multer individually while uploading file and using those avatar on each post that we have. The small icon that shows just next to your name. Here we are just uploading the avatar, later we could use the multer to upload any generic file data. And for that we will need to use multer in some or the other file.
const path = require('path');       //The Path module provides a way of working with directories and file paths.
const AVATAR_PATH = path.join('/uploads/users/avatar');     //This is just a variable.


const userSchema = new mongoose.Schema({
    email :{
        type : String,
        required : true,
        unique : true
    },
    password :{
        type : String,
        required : true,        
    },
    name :{
        type: String,
        required: true        
    },
    avatar :{
        type : String
    }
},{
    timestamps : true
});

//The following lines of code is just downloaded from the documentation. We can copy the codes but understand it well, why do we even use it.
const storage = multer.diskStorage({        //multer.disStorage will be used to save on the same machine, this means it will be saved on the same server where we have all the files saved.
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..' , AVATAR_PATH));      //The second argument always takes up the path in the string format, this simply means, we could provide the string path in a broken up fahsion.
    },
    filename: function (req, file, cb) {            //We need to define the file name of the file that user uploads, this would be reuqired since there could be two users with the same file name. And this is why we will either use random number or we would be using the timestamp of milliseconds using Date.now() mehtod that would be unique in itself. Date.now() is an epoch time,it will be used to find the relative time as compared to the computer clock.
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)       //This is going to make the filename even much more unique, since we are taking the timefactor as well as we are taking into account the random number that is being generated.
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
//At this point we have only defined the storage variable and not used it.


//Statics methods - I have explained this in detail in my nodejs.docx file. But in short we can simply say that these are like the static methods of class, accessible to all the Schema, and not just one instance of schema.
userSchema.statics.uploadedAvatar = multer({storage : storage}).single('avatar');
//In the storage property of multer, the value of the object storage is added to multer. .single('avatar') means only one single instance of avatar will be uploaded, since we do not want to store multiple avatars for single user.
userSchema.statics.avatarPath = AVATAR_PATH;        //This will make it available to all the objects of userSchema that the path to access the avatarPath is this. Also since we are exporting User, it could be visible anywhere in the whole project, this is to make sure, we are looking at the right directory.


const User = mongoose.model('User', userSchema);

module.exports = User;