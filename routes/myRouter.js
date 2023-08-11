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

router.get("/fever", (req,res)=>{
    res.render("fever")
})

router.get("/diarrhea", (req,res)=>{
    res.render("diarrhea")
})

router.get('/urticaria', (req,res)=>{
    res.render("urticaria")
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
    History.find({"StudentNumber":data1.StudentNumber}).exec((err,doc1)=>{
            data = doc1.slice(-1)[0]
            res.render('gencodepara',{data:data})
        })
    })

router.get('/gencodepost',(req,res)=>{
    History.find({"StudentNumber":data1.StudentNumber}).exec((err,doc1)=>{
        data = doc1.slice(-1)[0]
        res.render('gencodepara',{data:data})
    })
})

router.get('/approvepromise',(req,res)=>{
    res.render('approvepromise')
})

router.get('/promise',(req,res)=>{
    res.render('promise')
})

router.get('/emergency',(req,res)=>{
    res.render('emergency')
})

router.get('/emergencysend',(req,res)=>{
    res.render("emergencysend")
})

router.get('/404', (req,res)=>{
    res.render("notfound")
})



router.get('/admin', (req,res)=>{
    console.log(req.query["Topic-show"])
    let fil_topic = req.query["Topic-show"]
    let fil_date_raw = req.query["select-date"]
    console.log(fil_date_raw)
    if(fil_date_raw){
        let fil_date = fil_date_raw.slice(8,10) + '/' +fil_date_raw.slice(5,7) + '/' + fil_date_raw.slice(0,4)
        console.log(fil_date)
        if (fil_date && fil_topic == "all"){
            History.find({"Detail.date":fil_date}).exec((err,doc)=>{
                console.log("all")
                console.log(doc)
                if(err) console.log(err)
                res.render("admin", {data:doc})
            })
        }else if (fil_date && fil_topic){
            History.find({"Detail.date":fil_date,"Detail.Send":fil_topic}).exec((err,doc)=>{
                console.log("true/false")
                if(err) console.log(err)
                res.render("admin", {data:doc})
            })
        }
    }else{
        History.find().exec((err,doc)=>{
            res.render("admin", {data:doc})
        })
    }
    
})


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


const randome_serial = function(){
    let ran_str = ''
    for (let i = 0; i < 5; i++){
        let ran = Math.floor(Math.random() * 10)
        ran_str += String(ran)
    }
    History.find({"Detail.Serial":ran_str}).exec((err,doc)=>{
        if(doc[0]){
            randome_serial()
        }else{
            return ran_str
        }
    })
    return ran_str
}

router.get('/admin/:id',(req,res)=>{
    let serial_id = req.params.id
    History.findOne({"Detail.Serial":serial_id}).exec((err,doc)=>{
        if(err) res.redirect('/admin')
        console.log(doc)
        res.render("detail", {item:doc})
    })
})

router.post('/admin-approve', (req,res)=>{
    let update_id = req.body.update_id
    let data = {
        StudentNumber:req.body.StudentNumber,
        Room:req.body.Room,
        Number:req.body.Number,
        Symptom:req.body.Symptom,
        Range:req.body.Range,
        Temp:req.body.Temp,
        Age:req.body.Age,
        Weight:req.body.Weight,
        Cause:req.body.Cause,
        Detail:{
            Serial:req.body.Serial,
            Send:true,
            date:req.body.date,}
    }
    History.findByIdAndUpdate(update_id,data,{userFindAndModify:false}).exec(err=>{
        res.redirect('/admin')
    })
})

router.post('/student_sing_in',(req,res)=>{
    StudentData.find({"StudentNumber":req.body.StudentNumber}).exec((err,doc)=>{
        data1 = datafirst(req.body.StudentNumber, req.body.Class,req.body.Room ,req.body.Number)
        // console.log(data1)
        if(data1.Room == doc[0]["Room"] && data1.Number == doc[0]["Number"] && data1.StudentNumber == doc[0]["StudentNumber"]){
            console.log("I'm In")
            res.redirect("/select")
        }else{
            res.redirect("/404")
        }
    })
    
})

router.post('/student_from',(req,res)=>{
    console.log(data1)
    StudentData.findOne({"StudentNumber":Number(data1.StudentNumber)}).exec((err,doc)=>{
        console.log(doc)
        let data = new History({
            StudentNumber:data1.StudentNumber,
            StudentName:doc.StudentName,
            Room:data1.Room,
            Number:Number(data1.Number),
            Symptom:req.body.Symptom,
            Age:Number(req.body.Age),
            Weight:Number(req.body.Weight),
            Cause:req.body.Cause,
            Range:Number(req.body.Range),
            Temp:Number(req.body.Temp),
            Deta_poo:req.body.Deta_poo,
            time_poo:req.body.time_poo,
            poo_time:req.body.poo_time,
            Detail:{
                Serial:randome_serial(),
                SendBy:req.body.SendBy,
                SendStatus:false,
                Time:new Date().toLocaleTimeString([],{hour: '2-digit',minute: '2-digit',}),
                date:formatDate(new Date())},
        })
        console.log(data)
    })
    // History.save(data,(err)=>{
    //     if(Number(req.body.Temp) >= 38){
    //         if(err) console.log(err)
    //         if(req.body.Symptom == "ปวดประจำเดือน"){
    //             res.redirect('/gencodepost')
    //         }else if(req.body.Symptom == "ปวดหัว"){
    //             res.redirect('/gencodepara')
    //         }
    //     }else{
    //         res.redirect('/approve')
    //     }
    // })

})

router.post('/promise_in',(req,res)=>{
    res.redirect('/approvepromise')
})

module.exports = router 