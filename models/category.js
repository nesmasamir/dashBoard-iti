const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
   checked: {
        type: Boolean,
    }
})

exports.Category = mongoose.model('Category', categorySchema);







   
