const Data = require("../model/Data")
const XLSX = require("xlsx")
const fs = require('fs')

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

module.exports = {formatDate, random_serial, fetchData}



// console.log(random_serial())
// console.log(formatDate(new Date()))