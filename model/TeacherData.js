// use mongoose
const mongoose = require('mongoose')

// connect mongodb alats
const mongodburl = "mongodburl"

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
