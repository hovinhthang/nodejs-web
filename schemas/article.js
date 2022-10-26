const mongoose = require('mongoose');
const databaseConfig = require('../configs/database');
var autoIncrement = require('mongoose-auto-increment');
var slug = require('mongoose-slug-generator');
var updateSlug = require('mongoose-slug-updater');
mongoose.plugin(slug);
mongoose.plugin(updateSlug);

const schema = new mongoose.Schema
({
     userName: String,
     status: String ,
     trend : String,
     ordering:Number,
     group_acp:String,
     thumb:String,
     category:{
         id: String,
         name: String,
        
     },
     countView:{
        type: Number,
        default:0
    },
     content: String,
     slug: {type: String,  slug:  'userName', unique:   true},
     crated:{
        user_id: Number,
        user_name : String,
        time: Date,
    },
    modified:{
        user_id: Number,
        user_name: String,
        time: Date,
    },
});

autoIncrement.initialize(mongoose.connection);
schema.plugin(autoIncrement.plugin, '_id');


module.exports = mongoose.model(databaseConfig.article,schema);


