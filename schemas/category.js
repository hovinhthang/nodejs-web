const mongoose = require('mongoose');
const databaseConfig = require('./../configs/database');
var autoIncrement = require('mongoose-auto-increment');
var slug = require('mongoose-slug-generator');
var updateSlug = require('mongoose-slug-updater');

mongoose.plugin(slug);
mongoose.plugin(updateSlug);

const schema = new mongoose.Schema
({
     name: String,
     status: String ,
     ordering:Number,
     group_acp : String,
     content: String,
     slug: {type: String, unique:   true},
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
schema.plugin(autoIncrement.plugin, 'id');
var Counter = mongoose.model('id', schema);

module.exports = mongoose.model(databaseConfig.category,schema);


