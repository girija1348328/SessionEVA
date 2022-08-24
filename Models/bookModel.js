const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
      
    author: {
        type: String,
        required: true,
        trim: true
    },
    
    
    category: {
        type: String,
        required: true,
        trim: true
    },
  
  
  
   


}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema); 