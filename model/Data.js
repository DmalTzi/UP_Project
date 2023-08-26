// use mongoose
const mongoose = require('mongoose')

// connect mongodb alats
const mongodburl = "mongodb+srv://hdrproject:50230@cluster0.ktm1unb.mongodb.net/?retryWrites=true&w=majority"

mongoose.set('strictQuery', true);

mongoose.connect(mongodburl,{dbName:"HDRProjecct"},{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err=>console.log(err))

// schema design

let dataSchema = mongoose.Schema({
    userId:String,
    TeacherUser:String,
    TeacherName:String,
    StudentNumber:Number,
    StudentName:String,
    Room:Number,
    Number:Number,
    Symptom:String,
    Age:Number,
    Weight:Number,
    Cause:String,
    Range:Number,
    Temp:Number,
    Date_poo:String,
    Time_poo:String,
    Poo_time:Number,
    Detail:{
        UserBy:String,
        Serial:Number,
        SendBy:String,
        SendStatus:Boolean,
        Time:String,
        date:String
    },
})

// carete mode
let Data = mongoose.model("wtf",dataSchema)

module.exports = Data

module.exports.save=function(model,data){
    model.save(data)
}