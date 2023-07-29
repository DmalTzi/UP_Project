const express = require('express')
const router = express.Router()
const History = require('../model/Data')
const StudentData = require('../model/StudentData')

router.get('/',(req,res)=>{
    res.render('student')
})

router.get('/teacher', (req,res)=>{
    res.render("teacher")
})

router.get('/headache',(req,res)=>{
    res.render("headache")
})

router.get('/men',(req,res)=>{
    res.render("men")
})

router.get('/select',(req,res)=>{
    res.render("select")
})

let time =  10

const datafirst = function(StudentNumberI,ClassI,RoomI,NumberI){
    var data1 = {
        StudentNumber:StudentNumberI,
        Room:Number([ClassI,'0',RoomI].join('')),
        Number:NumberI
    } 
    return data1
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

function formatDateForRandom(date) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
    date.getFullYear()
    ].join('')
}

const randome_serial = function(){
    if(time >= 98){
        time = 10
    }
    if(time <=98){
        getnumbet = formatDateForRandom(new Date())+time
        time++
    }
    return getnumbet
}

router.post('/student_sing_in',(req,res)=>{
    StudentData.find({"StudentNumber":req.body.StudentNumber}).exec((err,doc)=>{
        data1 = datafirst(req.body.StudentNumber, req.body.Class,req.body.Room ,req.body.Number)
        console.log(data1)
        if(data1.Room == doc[0]["Room"] && data1.Number == doc[0]["Number"] && data1.StudentNumber == doc[0]["StudentNumber"]){
            console.log("I'm In")
            res.redirect("/select")
        }else{
            res.redirect("/404")
        }
    })
    
})

router.get('/404', (req,res)=>{
    res.render("notfound")
})

router.post('/student_from',(req,res)=>{
    let data = new History({
        StudentNumber:data1.StudentNumber,
        Room:data1.Room,
        Number:data1.Number,
        Symptom:req.body.Symptom,
        Range:req.body.Range,
        Detail:{
            Serial:randome_serial(),
            Send:false,
            Time:1,
            date:formatDate(new Date())
        }
    })
    History.save(data,(err)=>{
        if(err) console.log(err)
        res.redirect('/404')
    })
    console.log(data)
})

module.exports = router 