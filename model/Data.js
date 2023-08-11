// use mongoose
const mongoose = require('mongoose')

// connect mongodb alats
const mongodburl = "mongodb+srv://hdrproject:50230@cluster0.ktm1unb.mongodb.net/?retryWrites=true&w=majority"


mongoose.connect(mongodburl,{dbName:"HDRProjecct"},{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err=>console.log(err))

// schema design

let dataSchema = mongoose.Schema({
    StudentNumber:Number,
    StudenName:String,
    Room:Number,
    Number:Number,
    Symptom:String,
    Age:Number,
    Weight:Number,
    Cause:String,
    Range:Number,
    Temp:Number,
    Date_poo:String,
    time_poo:String,
    poo_time:Number,
    Detail:{
        Serial:Number,
        SendStatus:Boolean,
        SendBy:String,
        Time:String,
        date:String
    },
    TeacherNumber:String,
    TeacherPassword:String
})

// carete mode
let History = mongoose.model("History",dataSchema)

module.exports = History

// export model
module.exports.save=function(model,data){
    model.save(data)
}