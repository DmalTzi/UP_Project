const History = require('../model/Data')




let ran_str = ''

for (let i = 0; i < 5; i++){
    let ran = Math.floor(Math.random() * 10)
    ran_str += String(ran)
    console.log(ran)
}
console.log(Number(ran_str))

