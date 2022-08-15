const express = require('express');
const cookieParser = require('cookie-parser');
const app=express();
const index=require('./routes/index');
const db=require('./config/mongoose');
const session= require('express-session');      
const passport=require('passport');    
const passportLocal= require('./config/passport-local-strategy');     
const passportJwt = require('./config/passport-jwt-strategy');
const googleStrategy = require('./config/passport-google-oauth2-strategy');
const MongoStore= require('connect-mongo');    
const flashMsg = require('connect-flash');
const customMiddleware= require('./config/middleware');

const URL = require('./server').DB_URL;
const port=require('./server').PORT;


const expressEjsLayouts = require('express-ejs-layouts');       


const sassMiddleware = require('node-sass-middleware');     

app.use(expressEjsLayouts);     
app.set('layout extractStyles', true);  
app.set('layout extractScripts', true);     


//This sass middle ware must be included before any of the server action, as we want the css files to be compiled and loaded before the server computation starts.
app.use(sassMiddleware({
    src: './assets/scss',        //From here we pick up the scss file to be converted to css.
    dest: './assets/css',        //This is where we will put the css file.
    debug : false,               //We do not want anything to be debug in the console window once the website goes into the production mode. Output is only used to debug while in developement mode.
    outputStyle: 'extended',    //Whether we want our output to be done in one line or multiple lines, etc.
    prefix: '/css'      
}));


app.use(express.urlencoded());
app.use(cookieParser());        //This needs to run the cookie and read and write it. It is a middleware.

app.use(express.static(__dirname + '/assets'));     //Static folders must be defined by the express app. As we cannot directly use and  add the external css file in the layout.ejs file. It is kept inside the static folder and we could access it when ever we require.
app.use('/uploads',express.static(__dirname + '/uploads'));

app.set('view engine', 'ejs');
app.set('views','./views');


//We need to create a middle ware that takes the session cookie and encrypts it. This has to be a middle ware, since before any actual process to be completed, the middle layer has to take care of the authentication part. This is one of the main purpose of middle ware.
//Also be sure to keep this session cookie middle ware after all essential files have been loaded. Like the db connection, server running. Even the cookieParser() must be run before. So that it could be parsed first and then it will be sent to the middle ware. Even urlEncoded() mehtod needs to be run way before all of these. since that collects data from the form.
// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',        //This will be referred as the name of the cookie.
    // TODO change the secret before deployment in production mode, this is important, remember the APIkey should never be shared, so it the encryption key, this should be kept in a separarte process.env local file, all it will be provided separately on the hosting website. 
    secret: 'blahsomething',        //This is the key.
    saveUninitialized: false,       //When the user is not logged in, then it is not initialised, basically then the cookie does not need to save any data. Then we must not save any data.
    resave: false,                  //This means when the session data is created, every time I refresh the page do I need to re write the cookie? No. It must be saved once and unless we log out no need to rewrite the cookie.
    cookie: {
        maxAge: (1000 * 60 * 100)       //This is the age of the cookie, the real time age in milliseconds. For this much time the cookie will be valid then it will be deleted automatically. This is to ensure the space efficiency. And in case of the sensitive websites, like the bank, where if you do not have any activity for 10 minutes, this cookie expires.
        //There are many more different properties of cookie that could be set. Just google "express session documentation" and on that page will be the details of how to manupulate and control the cookie data.
    }
    ,
    store:  MongoStore.create(      //There is some important comparision about MongoStore.create() and this function in my node.js notes, just read it out.
        {
            mongoUrl: URL,     //This parameter is simply taking this parameter as the mongoose connection is added in the file.
            autoRemove: 'disabled'      //This will not allow the session cookie to be deleted from the db.
        
        },
        function(err){      //In case there is some error with connection to mongodb.
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize()); //Every time any end point is hit, passport will get initialised, as all of these are the middle ware.
app.use(passport.session());
// require('./config/passport-local-strategy')(passportLocal);

app.use(passportLocal.setAuthenticatedUser);        //Even if we comment out this line, the req.user in all the methods consist of authentication data. res.locals.user will also have the user data.
//The most important point about all the app.use method is that, when ever any address or subdomain is hit, it will go through all the middleware with the name of app.use(), including this one. This is how for each and every page we check the authentication. As this middleware will call the passportLocal.setAuthenticatedUser method.


app.use(flashMsg());       //This is going to be used after the session has been loaded, since the session is the one that stores the flash messages. And session will keep track of whether the session is on or not, or else the messages will keep on repeating, every time I refresh the pages.
app.use(customMiddleware.flashController);      //This is the most global kind of middleware usage, any end points that is being hit, will pass through this one, this also means, if any end point consists of req.flash object, then the flash message will be output.




app.use('/',index);     //What ever be the domain or subdomain that is getting hit, this will be called all the time. As this is the middle ware.

app.listen(port,function(err){
    if(err){
        console.log('Error Occured ' + err);
        return;
    }
    console.log('Server running on port : '+port);
});