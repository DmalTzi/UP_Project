const line = require("@line/bot-sdk")
const express = require('express')
const router = express.Router()
const dotenv = require("dotenv")
const axios = require("axios").default
const env = dotenv.config().parsed
const Data = require("../model/Data")
const StudentData = require('../model/StudentData')
const fun = require("./function")
const TeacherData = require('../model/TeacherData')


const lineConfig = {
    channelAccessToken: env.ACCESS_TOKEN,
    channelSecret: env.SECRET_TOKEN
}

const client = new line.Client(lineConfig)

router.get("/",(req,res)=>{
    res.render("index")
})

router.get("/teacher", (req,res)=>{
    res.render("teacher")
})

router.post("/teacher/login",(req,res)=>{
    teacher_user = req.body.TeacherId
    teacher_pass = req.body.TeacherPassword
    userby = req.body.UserBy
    TeacherData.findOne({"User":teacher_user}).then((result) => {
        console.log(teacher_user, teacher_pass)
        console.log(result)
        if (result != null){
            if (teacher_user == result.User && teacher_pass == result.Password){
                res.render("select")
            }else{
                res.render("404")
            }
        }else{
            res.render("404")
        }
    }).catch((err) => {
        console.log(err)
    });
})

router.get("/admin", (req,res)=>{
    fil_topic = req.query.Topic_show
    console.log(fil_topic)
    Data.find().then((result) => {
        // console.log(result)
        if (fil_topic == undefined || fil_topic == "All"){
            res.render("admin", {data:result})
        }else if(fil_topic == "รอครูอนุมัติ"){
            console.log("รออนุมัติยยยย")
            Data.find({"Detail.SendBy":fil_topic}).then((result) => {
                res.render("admin", {data:result})
            });
        }else if(fil_topic == "อนุมัติโดยระบบ"){
            Data.find({"Detail.SendBy":fil_topic}).then((result) => {
                res.render("admin", {data:result})
            });
        }else if(fil_topic == "อนุมัติโดยครู"){
            Data.find({"Detail.SendBy":fil_topic}).then((result) => {
                res.render("admin", {data:result})
            });
        }else{
            res.render("admin", {data:result})
        }
    }).catch((err) => {
        console.log(err)
    });
})

router.get("/admin/:serial", (req,res)=>{
    let serial_name = req.params.serial
    Data.findOne({"Detail.Serial":serial_name}).then((result) => {
        res.render("detail", {item:result})
    })
})

router.post("/approve", (req,res)=>{
    let update_id = req.body.update_id
    console.log("update_id : ",update_id)
    let data = {
        userId:req.body.userid,
        TeacherUser:req.body.TeacherUser,
        TeacherName:req.body.TeacherName,
        StudentNumber:req.body.StudentNumber,
        StudentName:req.body.StudentName,
        Room:req.body.Room,
        Number:req.body.Number,
        Symptom:req.body.symptom,
        Age:req.body.Age,
        Weight:req.body.Weight,
        Cause:req.body.Cause,
        Range:req.body.Range,
        Temp:req.body.Temp,
        Date_poo:req.body.Deta_poo,
        Time_poo:req.body.Time_poo,
        Poo_time:req.body.Poo_time,
        Detail:{
            UserBy:req.body.Userby,
            Serial:req.body.Serial,
            SendBy:"อนุมัติโดยครู",
            SendStatus:false,
            Time:req.body.Time,
            date:req.body.date},
    }
    if(req.body.TeacherName)client.pushMessage(to=req.body.userid,{type:"text",text:`${req.body.TeacherName}\nรหัสของคุณคือ : ${req.body.Serial} \nสามารถนำไปกรอกได้ที่ตู้กดยาอัจฉริยะที่หน้าห้องพยาบาล`});
    else if (req.body.StudentName)client.pushMessage(to=req.body.userid,{type:"text",text:`${req.body.StudentName}\nรหัสของคุณคือ : ${req.body.Serial} \nสามารถนำไปกรอกได้ที่ตู้กดยาอัจฉริยะที่หน้าห้องพยาบาล`})
    Data.findByIdAndUpdate(update_id, data, {useFindAndModify:false}).exec(err=>{
        res.redirect(`/admin?Topic_show=${fil_topic}`)
    })

    // console.log(update)
})

router.post("/api/v1/link-richmenu", (req,res)=>{
    console.log(req.body)
    userid = req.body.userId
    console.log(userid)
    // res.redirect('/student_sign_in')
})

router.post("/student_sign_in",(req,res)=>{
    console.log(req.body)
    studentnumber = req.body.StudentNumber
    studentclassroom = Number([req.body.Class,'0',req.body.Room].join(''))
    numberstudent = req.body.Number
    userby = req.body.UserBy
    StudentData.findOne({"StudentNumber":Number(req.body.StudentNumber)}).then((result) => {
        console.log(studentnumber, studentclassroom, numberstudent)
        console.log(result)
        if (result != null){
            if (studentnumber == result.StudentNumber && studentclassroom == result.Room && numberstudent == result.Number){
                res.render("select")
            }else{
                res.render("404")
            }
        }else{
            res.render("404")
        }
    }).catch((err) => {
        console.log(err)
    });
})

router.get("/student_sign_in/:symptom", (req,res)=>{
    let name_symptom = req.params.symptom
    if (name_symptom == "headache"){res.render('headache')}
    else if (name_symptom == "fever"){res.render('fever')}
    else if (name_symptom == "men"){res.render('men')}
    else if (name_symptom == "diarrhea"){res.render('diarrhea')}
    else if (name_symptom == "urticaria"){res.render('urticaria')}
})

router.post("/update", (req,res)=>{
    if(req.body.Temp >= 38){
        SendBy = "อนุมัติโดยระบบ"
        if(req.body.TeacherName);
    }else{
        SendBy = "รอครูอนุมัติ"
    }
    
    if(userby == "Student"){
        StudentData.findOne({"StudentNumber":studentnumber}).then((result) => {
            let data = new Data({
                userId:userid,
                StudentNumber:studentnumber,
                StudentName:result.StudentName,
                Room:studentclassroom,
                Number:numberstudent,
                Symptom:req.body.Symptom,
                Age:req.body.Age,
                Weight:req.body.Weight,
                Cause:req.body.Cause,
                Range:req.body.Range,
                Temp:req.body.Temp,
                Date_poo:req.body.Deta_poo,
                Time_poo:req.body.time_poo,
                Poo_time:req.body.poo_time,
                Detail:{
                    UserBy:userby,
                    Serial:fun.random_serial(),
                    SendBy:SendBy,
                    SendStatus:false,
                    Time:new Date().toLocaleTimeString([],{hour: '2-digit',minute: '2-digit'}),
                    date:fun.formatDate(new Date())},
            })
            console.log(data)
            if(req.body.Temp >= 38){client.pushMessage(to=userid,{type:"text",text:`${result.StudentName}\nรหัสของคุณคือ : ${data.Detail.Serial} \nสามารถนำไปกรอกได้ที่ตู้กดยาอัจฉริยะที่หน้าห้องพยาบาล`})}
            Data.save(data)
        })
    }else if(userby == "Teacher"){
        TeacherData.findOne({"User":teacher_user}).then((result) => {
            let data = new Data({
                userId:userid,
                TeacherUser:teacher_user,
                TeacherName:result.TeacherName,
                Symptom:req.body.Symptom,
                Age:req.body.Age,
                Weight:req.body.Weight,
                Cause:req.body.Cause,
                Range:req.body.Range,
                Temp:req.body.Temp,
                Date_poo:req.body.Deta_poo,
                Time_poo:req.body.time_poo,
                Poo_time:req.body.poo_time,
                Detail:{
                    UserBy:userby,
                    Serial:fun.random_serial(),
                    SendBy:SendBy,
                    SendStatus:false,
                    Time:new Date().toLocaleTimeString([],{hour: '2-digit',minute: '2-digit'}),
                    date:fun.formatDate(new Date())},
            })
            console.log(data)
            if(req.body.Temp >= 38){client.pushMessage(to=userid,{type:"text",text:`${result.TeacherName}\nรหัสของคุณคือ : ${data.Detail.Serial} \nสามารถนำไปกรอกได้ที่ตู้กดยาอัจฉริยะที่หน้าห้องพยาบาล`})}
            Data.save(data)
        })
    }
})




// router.post("/webhook", line.middleware(lineConfig), async (req,res)=>{
//     try{
//         const events = req.body.events
//         // console.log("event=>>>>>>",events)
//         return events.length > 0 ? await events.map(item => handleEvent(item)) : res.status(200).send("ok")
//     } catch (error){
//         console.log(error)
//         res.status(500).end()
//     }
// })

// const handleEvent = async (event)=>{
//     console.log(event)
//     return client.pushMessage(to="U8ceb07e1a18493975adbcbacf9b63368",{type:"text",text:"Hello World Test"})
// }

module.exports = router