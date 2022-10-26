const mongoose = require('mongoose');
const databaseConfig = require('../configs/database');

var autoIncrement = require('mongoose-auto-increment');
var slug = require('mongoose-slug-generator');
var updateSlug = require('mongoose-slug-updater');

mongoose.plugin(slug);
mongoose.plugin(updateSlug);

const schema = new mongoose.Schema
({
     name: String,
     title: String,
     status: String ,
     content: String,
     email : String,
     status:String,
     crated:{ 
          time: Date,
      },
   
});

autoIncrement.initialize(mongoose.connection);
schema.plugin(autoIncrement.plugin, 'id');


module.exports = mongoose.model(databaseConfig.contact,schema);


