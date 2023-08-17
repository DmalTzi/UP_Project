// use mongoose
const mongoose = require('mongoose')

// connect mongodb alats
const mongodburl = "mongodb+srv://hdrproject:50230@cluster0.ktm1unb.mongodb.net/?retryWrites=true&w=majority"

mongoose.set('strictQuery', true);

mongoose.connect(mongodburl,{dbName:"HDRProjecct"},{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err=>console.log(err))


let TeacherData = mongoose.model("teacherdata", mongoose.Schema({
    TeacherName:String,
    User:String,
    Password:String
}))

module.exports = TeacherData
