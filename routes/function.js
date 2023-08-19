const Data = require("../model/Data")

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

module.exports = {formatDate, random_serial}



// console.log(random_serial())
// console.log(formatDate(new Date()))