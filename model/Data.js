// use mongoose
const { Double } = require('mongodb')
const mongoose = require('mongoose')

// connect mongodb alats
const mongodburl = "mongodb+srv://hdrproject:50230@cluster0.ktm1unb.mongodb.net/?retryWrites=true&w=majority"


mongoose.connect(mongodburl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err=>console.log(err))

// schema design

let dataSchema = mongoose.Schema({
    StudentNumber:Number,
    StudentName:String,
    Level:String,
    Number:Number,
    From:{
        Age:Number,
        Weight:Number,
        Temp:Number,
        Symptom:String,
        Range:Number,
    },
    TeacherNumber:String,
    TeacherPassword:String
})

// carete mode
let Data = mongoose.model("Data",dataSchema)

module.exports = Data

// export model
module.exports.save=function(model,data){
    model.save(data)
}