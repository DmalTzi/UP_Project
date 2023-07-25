const express = require('express')
const router = express.Router()
const Data = require('../model/Data')

router.get('/',(req,res)=>{
    res.render('student')
})

router.get('/teacher', (req,res)=>{
    res.render("teacher")
})

router.get('/from',(req,res)=>{
    res.render("from")
})

const datafirst = function(StudentNameI,StudentNumberI,LevelI,NumberI){
    var data1 = {
        StudentName:StudentNameI,
        StudentNumber:StudentNumberI,
        Level:LevelI,
        Number:NumberI
    } 
    return data1
}

router.post('/student_sing_in',(req,res)=>{
    data1 = datafirst(req.body.StudentName, req.body.StudentNumber, req.body.Level, req.body.Number)
    console.log(data1)
    res.redirect("/from")
})

router.get('/404', (req,res)=>{
    res.render("notfound")
})

router.post('/student_from',(req,res)=>{
    let data = new Data({
        StudentName:data1.StudentName,
        StudentNumber:data1.StudentNumber,
        Level:data1.Level,
        Number:data1.Number,
        From:{
            Age:req.body.Age,
            Weight:req.body.Weight,
            Temp:req.body.Temp,
            Symptom:req.body.Symptom,
            Range:req.body.Range,
        }
    })
    Data.save(data,(err)=>{
        if(err) console.log(err)
        res.redirect('/404')
    })
    console.log(data)
})

module.exports = router 