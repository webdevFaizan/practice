const mongoose = require('mongoose');

//These model have a two way relationships, both the post and comment models consists of this model as 'ref' and this model is also having the reference of Post or Comment, the utility of this functionality is that using the dyncamic programming would make the whole system faster. And with the two way relationship the accessing of post or comment or user data would be faster.
const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    // this defines the object id of the liked object, but since we are not sure what is the id, we have named it likable, we have to select between the Post or Comment but we do not know which one will be this. So we have to do it through dynamic modeling. This is the main reason why we had to add the refPath.
    likeable: {     //I would like to keep an alternate name for this, LikeParent, //Likeable will tell us the parent that would be decided dynamically.
        type: mongoose.Schema.Types.ObjectId,     
        require: true,
        refPath: 'onModel'      //If the key was 'ref' here, then this could have been populated directly as the model would have been selected, but here we have refPath, hence the model will be selected as per the parent.
    },
    // this field is used for defining the type of the liked object since this is a dynamic reference
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment']       //These are the models which will be used to select or switch between, and the ref would be selected from these 2.
        //Just to be sure that only these 2 models will have the like field, we have added enum, instead if we had not added this field, any field could have this onModel field.
    }
}, {
    timestamps: true
});


const Like = mongoose.model('Like', likeSchema);
module.exports = Like;