const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    path:{
        type:String,
        require:[true , 'Path is required']
    },
    originalname:{
        type:String,
        required:[true,'originalname is required']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:[true,'user is required']
    }

})

const file = mongoose.model('file',fileSchema)

module.exports= file