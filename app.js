const express = require("express")
const path = require("path")
const app = express()
const router = require("./routes/router")
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'));
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json());

app.use(router)

app.listen(5000, ()=>{
    console.log("listening on 5000")
})