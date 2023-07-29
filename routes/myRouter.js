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

router.get('/approve',(req,res)=>{
    res.render("approve")
})

router.get('/gencodepara',(req,res)=>{
    para_box_code = ['736532', '739664', '731618', '731362', '732476', '736289', '733498', '733941', '732624', '736562', '736995', '731945', '732533', '736876', '735195', '736564', '737915', '739584', '736112', '732558', '739517', '737949', '738948', '738619', '732148', '731315', '731535', '736562', '737968', '735533', '732872', '737489', '738139', '736745', '732555', '734383', '735943', '735324', '738813', '733387', '731441', '738227', '734254', '735273', '731718', '734831', '734934', '733983', '735814', '737179', '735413', '731523', '731272', '735494', '738829', '733145', '732965', '737248', '731913', '733515', '733358', '739795', '737166', '733973', '737881', '737474', '736955', '734267', '732714', '737629', '737897', '737139', '734814', '736818', '739244', '734117', '734432', '732557', '738539', '733818', '732462', '732777', '739654', '733524', '733349', '739225', '736819', '733398', '732316', '736958', '732579', '738336', '738435', '736191', '733739', '732744', '736227', '731315', '735689', '734727']
    res.render('gencodepara',{code:para_box_code})
})

router.get('/gencodepost',(req,res)=>{
    post_box_code = ['767465', '767179', '767328', '767269', '767197', '767128', '767155', '767979', '767338', '767249', '767298', '767547', '767859', '767837', '767316', '767611', '767851', '767422', '767469', '767453', '767481', '767435', '767889', '767967', '767449', '767161', '767922', '767893', '767583', '767663', '767996', '767283', '767799', '767398', '767229', '767265', '767677', '767455', '767262', '767294', '767559', '767334', '767343', '767771', '767411', '767738', '767961', '767338', '767797', '767796', '767197', '767554', '767543', '767873', '767989', '767313', '767439', '767262', '767836', '767955', '767158', '767166', '767283', '767789', '767862', '767793', '767892', '767144', '767162', '767465', '767977', '767599', '767184', '767248', '767439', '767541', '767161', '767114', '767377', '767565', '767786', '767677', '767286', '767151', '767736', '767814', '767267', '767388', '767351', '767742', '767283', '767347', '767481', '767635', '767781', '767681', '767556', '767989', '767673', '767617']
    res.render('gencodepost',{code:post_box_code})
})

router.get('/approvepromise',(req,res)=>{
    res.render('approvepromise')
})

router.get('/promise',(req,res)=>{
    res.render('promise')
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
        Number:Number(data1.Number),
        Symptom:req.body.Symptom,
        Range:Number(req.body.Range),
        Temp:Number(req.body.Temp),
        Age:Number(req.body.Age),
        Weight:Number(req.body.Weight),
        Cause:req.body.Cause,
        Detail:{
            Serial:randome_serial(),
            Send:false,
            Time:1,
            date:formatDate(new Date())},
    })
    History.save(data,(err)=>{
        if(Number(req.body.Temp) >= 38){
            if(err) console.log(err)
            if(req.body.Symptom == "ปวดประจำเดือน"){
                res.redirect('/gencodepost')
            }else if(req.body.Symptom == "ปวดหัว"){
                res.redirect('/gencodepara')
            }
        }else{
            res.redirect('/approve')
        }
    })
    console.log(data)
})

router.post('/promise_in',(req,res)=>{
    res.redirect('/approvepromise')
})

module.exports = router 