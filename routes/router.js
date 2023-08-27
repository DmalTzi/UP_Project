const line = require("@line/bot-sdk")
const express = require('express')
const router = express.Router()
const dotenv = require("dotenv")
const env = dotenv.config().parsed
const Data = require("../model/Data")
const StudentData = require('../model/StudentData')
const fun = require("./function")
const TeacherData = require('../model/TeacherData')
const { DateTime } = require('luxon');
const XLSX = require("xlsx")


const lineConfig = {
    channelAccessToken: env.ACCESS_TOKEN,
    channelSecret: env.SECRET_TOKEN
}

const client = new line.Client(lineConfig)

router.get("/",(req,res)=>{
    res.render("lifflogin")
})

router.post("/api/liff/login", (req,res)=>{
    console.log(JSON.stringify({DateAndTime : new Date().toLocaleString(), api:"/api/liff/login"}))
    userid = req.body.userId
})

router.get("/sign_in",(req,res)=>{
    res.render("index")
})

router.get("/teacher", (req,res)=>{
    res.render("teacher")
})

router.get("/appointment", (req,res)=>{
    res.render("appointment")
})

router.get("/emergency", (req,res)=>{
    res.render("emergency")
})

router.post('/appointment/send', (req,res)=>{
    console.log(JSON.stringify({DateAndTime : new Date().toLocaleString(), api:"/appointment/send"}))
    client.pushMessage(to='U27b408af15934b6d93a487db9229ee0e',
        {type:"text",text:`การแจ้งขอนัดพบ \nคาบเรียนที่ : ${req.body.ClassPromise} \nของวันที่ : ${req.body.DatePromise}`})
        res.redirect('/')
})

router.post('/emergency/send', (req,res)=>{
    console.log(JSON.stringify({DateAndTime : new Date().toLocaleString(), api:"/emergency/send"}))
    client.pushMessage(to='U27b408af15934b6d93a487db9229ee0e',
        {type:"text",text:`มีเหตุด่วน!!! \nชื่อ : ${req.body.EmergencyName} ได้แจ้งเหตุด่วน \nเบอร์ติดต่อ : ${req.body.Tel} \nสถานที่เกิดเหตุ : ${req.body.WhereEvergency} \nอาการของผู้ประสบเหตุ : ${req.body.WhatHappen}`})
        res.redirect('/')
})

router.post("/teacher/login",(req,res)=>{
    console.log(JSON.stringify({DateAndTime : new Date().toLocaleString(), api:"/teacher/login"}))
    teacher_user = req.body.TeacherId
    teacher_pass = req.body.TeacherPassword
    userby = req.body.UserBy
    TeacherData.findOne({"User":teacher_user}).then((result) => {
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
        if (fil_topic == undefined || fil_topic == "All"){
            res.render("admin", {data:result})
        }else if(fil_topic == "รอครูอนุมัติ"){
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
    let serial = req.params.serial
    if (serial[0] == 'T'){
        Data.find({"TeacherUser":serial}).then((result) => {
            res.render("detail", {data:result})
        })
    }else{
        Data.find({"StudentNumber":serial}).then((result) => {
            res.render("detail", {data:result})
        })
    }
})

router.post("/disapprove", (req,res)=>{
    console.log("disapprove")
     console.log(JSON.stringify({DateAndTime : new Date().toLocaleString(), api:"/disapprove"}))
     console.log('topic ===> ',fil_topic)
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
             UserBy:req.body.UserBy,
             Serial:req.body.Serial,
             SendBy:"ไม่อนุมัติ",
             SendStatus:false,
             Time:req.body.Time,
             date:req.body.date},
     }
     client.pushMessage(to=req.body.userid,{type:"text",text:`ให้เลือกเมนู\n>>>ขอพบครู<<<\nเพื่อเข้ามารับยาภายในวันนี้`})
     Data.findByIdAndUpdate(update_id, data, {useFindAndModify:false}).exec(err=>{
         if(fil_topic){
             res.redirect(`/admin?Topic_show=${fil_topic}`)
         }else{
             res.redirect('/admin')
         }
     })
})

router.post("/approve", (req,res)=>{
    console.log("approved")
    console.log(JSON.stringify({DateAndTime : new Date().toLocaleString(), api:"/approve"}))
    console.log('topic ===> ',fil_topic)
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
            UserBy:req.body.UserBy,
            Serial:req.body.Serial,
            SendBy:"อนุมัติโดยครู",
            SendStatus:false,
            Time:req.body.Time,
            date:req.body.date},
    }
    if(req.body.TeacherName)client.pushMessage(to=req.body.userid,{type:"text",text:`${req.body.TeacherName}\nรหัสของคุณคือ : ${req.body.Serial} \nสามารถนำไปกรอกได้ที่ตู้กดยาอัจฉริยะที่หน้าห้องพยาบาลได้เลยนะคะ`});
    else if (req.body.StudentName)client.pushMessage(to=req.body.userid,{type:"text",text:`${req.body.StudentName}\nรหัสของคุณคือ : ${req.body.Serial} \nสามารถนำไปกรอกได้ที่ตู้กดยาอัจฉริยะที่หน้าห้องพยาบาลได้เลยนะคะ`})
    Data.findByIdAndUpdate(update_id, data, {useFindAndModify:false}).exec(err=>{
        if(fil_topic){
            res.redirect(`/admin?Topic_show=${fil_topic}`)
        }else{
            res.redirect('/admin')
        }
    })
})



router.post("/student_sign_in",(req,res)=>{
    console.log(JSON.stringify({DateAndTime : new Date().toLocaleString(), api:"/student_sign_in"}))
    studentnumber = req.body.StudentNumber
    studentclassroom = Number([req.body.Class,'0',req.body.Room].join(''))
    numberstudent = req.body.Number
    userby = req.body.UserBy
    StudentData.findOne({"StudentNumber":Number(req.body.StudentNumber)}).then((result) => {
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
    console.log(JSON.stringify({DateAndTime : new Date().toLocaleString(), api:"/update"}))
    if(req.body.Temp >= 38){
        SendBy = "อนุมัติโดยระบบ"
    }else{
        if(studentnumber){
            client.pushMessage(to='U27b408af15934b6d93a487db9229ee0e',{type:"text",text:`มีการขอยาเข้ามา \n กรุณาตรวจสอบและพิจารณาการให้ยาได้ที่ \nhttps://hdrproject.onrender.com/admin/${studentnumber}`})

        }else{
            client.pushMessage(to='U27b408af15934b6d93a487db9229ee0e',{type:"text",text:`มีการขอยาเข้ามา \n กรุณาตรวจสอบและพิจารณาการให้ยาได้ที่ \nhttps://hdrproject.onrender.com/admin/${teacher_user}`})
        }
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
                Date_poo:req.body.Date_poo,
                Time_poo:req.body.Time_poo,
                Poo_time:req.body.Poo_time,
                Detail:{
                    UserBy:userby,
                    Serial:fun.random_serial(),
                    SendBy:SendBy,
                    SendStatus:false,
                    Time:DateTime.now().setZone('Asia/Bangkok').toFormat('hh:mm a'),
                    date:DateTime.now().toFormat(`dd/MM/${DateTime.now().year + 543}`)},
            })
            if(req.body.Temp >= 38){client.pushMessage(to=userid,{type:"text",text:`${result.StudentName}\nรหัสของคุณคือ : ${data.Detail.Serial} \nสามารถนำไปกรอกได้ที่ตู้กดยาอัจฉริยะที่หน้าห้องพยาบาล`})}
            Data.save(data)
            console.log(JSON.stringify({MSG:"Data has saved", DateAndTime : new Date().toLocaleString(), DataIs:data}))
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
                    Time:DateTime.now().setZone('Asia/Bangkok').toFormat('hh:mm a'),
                    date:DateTime.now().toFormat(`dd/MM/${DateTime.now().year + 543}`)},
            })
            if(req.body.Temp >= 38){client.pushMessage(to=userid,{type:"text",text:`${result.TeacherName}\nรหัสของคุณคือ : ${data.Detail.Serial} \nสามารถนำไปกรอกได้ที่ตู้กดยาอัจฉริยะที่หน้าห้องพยาบาล`})}
            else{client.pushMessage(to=userid,{type:"text",text:`คุณครูได้ทราบเรื่องการขอรับยาเรียบร้อยแล้ว\nกรุณารอการยืนยันจากคุณครูสักครู่นะคะ...`})}
            Data.save(data)
            console.log(JSON.stringify({MSG:"Data has saved", DateAndTime : new Date().toLocaleString(), DataIs:data}))
    })
    }
    res.redirect("/")
})

router.get("/download/xlsx/data", async (req, res) => {
    let xlsx_data = await fun.fetchData();

    var ws = XLSX.utils.json_to_sheet(xlsx_data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    res.setHeader('Content-Disposition', 'attachment; filename=DaTa.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    const excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    res.end(excelData);
});

module.exports = router