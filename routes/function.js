const Data = require("../model/Data")
const dotenv = require("dotenv")
const env = dotenv.config().parsed
console.log(env)
const XLSX = require("xlsx")
const line = require("@line/bot-sdk")

const lineConfig = {
    channelAccessToken: 'SwhakFdIMPrzb2nN1w/DFTuX65NdrARcT8aJac3/D/doMn1JfbGe4uWOHFKSDaf+uN5GJQILjCwUtpa+BdlyOUzL0K1TxivFKzi5zQ9ZBlDPM2YbvIBev9XzAFB9701cr6F46Iri/k2RZiTp/CT6JwdB04t89/1O/w1cDnyilFU=',
    channelSecret: '830439d66d164630bc8cc7dcba3d215b'
}

const client = new line.Client(lineConfig)

box_of_admin = ['U27b408af15934b6d93a487db9229ee0e', 'U27b2b093b9df4bd104b10bcc79925ae0', 'U91a4edde79f7554d4438dddf30c83a65']



async function appointment_nofi(){
    for(let i = 0; i < box_of_admin.length; i++){
        let data = new Promise(resolve =>{
            resolve(box_of_admin[i])
        })
        client.pushMessage(to=await data,{type:"text",text:`การแจ้งขอนัดพบ \nคาบเรียนที่ : ${req.body.ClassPromise} \nของวันที่ : ${req.body.DatePromise}`})
    }
}

async function emergency_nofi(){
    for(let i = 0; i < box_of_admin.length; i++){
        let data = new Promise(resolve =>{
            resolve(box_of_admin[i])
        })
    client.pushMessage(to=await data,{type:"text",text:`มีเหตุด่วน!!! \nชื่อ : ${req.body.EmergencyName} ได้แจ้งเหตุด่วน \nเบอร์ติดต่อ : ${req.body.Tel} \nสถานที่เกิดเหตุ : ${req.body.WhereEvergency} \nอาการของผู้ประสบเหตุ : ${req.body.WhatHappen}`})
    }
}

async function update_nofi(){
    for(let i = 0; i < box_of_admin.length; i++){
        let data = new Promise(resolve =>{
            resolve(box_of_admin[i])
        })
        client.pushMessage(to=await data,{type:"text",text:`มีการขอยาเข้ามา \n กรุณาตรวจสอบและพิจารณาการให้ยาได้ที่ \nhttps://liff.line.me/2000223015-BYgnOXy0`})
    }
}

function random_serial(){
    console.log("i'm in random")
    let ran_str = ''
    for (let i = 0; i < 5; i++){
        let ran = Math.floor(Math.random() * 10)
        ran_str += String(ran)
    }
    Data.findOne({"Detail.Serial":ran_str}).then((result) => {
        if (result != null){random_serial()}
        else{return String(ran_str)}
    }).catch((err) => {
        console.log(err)
    });
    return (String(ran_str))
    
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
  
function formatDate(date) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
    date.getFullYear()
    ].join('/');
}



async function fetchData() {
    var data = [];
    return new Promise(resolve => {
        Data.find().then((res)=>{
            res.forEach(async (res) => {
                if(res.Detail.UserBy === "Student"){
                    dic = {
                        Date : res.Detail.date,
                        Time: res.Detail.Time,
                        Identity: String(res.StudentNumber), 
                        Name: res.StudentName, 
                        Room: res.Room, 
                        Number: res.Number, 
                        Symptom: res.Symptom, 
                        Age: res.Age, 
                        Weight: res.Weight,
                        Cause: res.Cause,
                        Range: res.Range,
                        Temp: res.Temp,
                        Date_poo: res.Date_poo,
                        Time_poo: res.Time_poo,
                        Poo_time: res.Poo_time,
                        UserBy: res.Detail.UserBy,
                        Serial: res.Detail.Serial,
                        SendBy: res.Detail.SendBy,
                        SendStatus: res.Detail.SendStatus,
                    }
                }else if(res.Detail.UserBy === "Teacher"){
                    dic = {
                        Date : res.Detail.date,
                        Time: res.Detail.Time,
                        Identity: res.TeacherUser, 
                        Name: res.TeacherName, 
                        Symptom: res.Symptom, 
                        Age: res.Age, 
                        Weight: res.Weight,
                        Cause: res.Cause,
                        Range: res.Range,
                        Temp: res.Temp,
                        Date_poo: res.Date_poo,
                        Time_poo: res.Time_poo,
                        Poo_time: res.Poo_time,
                        UserBy: res.Detail.UserBy,
                        Serial: res.Detail.Serial,
                        SendBy: res.Detail.SendBy,
                        SendStatus: res.Detail.SendStatus,
                    }
                }
                data.push(dic)
            });
            resolve(data);
        })
    });
}

module.exports = {formatDate, random_serial, fetchData, update_nofi, emergency_nofi, appointment_nofi}



// console.log(random_serial())
// console.log(formatDate(new Date()))