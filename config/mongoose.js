const mongoose= require('mongoose');

mongoose.connect(require('../server').DB_URL);

const db= mongoose.connection;
db.on('error',console.error.bind(console,"Error connecting to MongoDB"));

db.once('open',function(){
    console.log('Connected to mongo successfully');
});

module.exports = db;


