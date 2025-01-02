const express = require('express')
const dotenv = require('dotenv')
dotenv.config()

const userRouter = require('./routes/user.routes')
const indexRouter = require('./routes/index.routes')
const connectToDB = require('./config/db')
connectToDB()

const cookieParser = require('cookie-parser')
const {cookie} = require('express-validator')


const app = express()

app.set("view engine" , "ejs")
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/',(req,res)=>{
    res.render('index')
})
app.use('/', indexRouter)
app.use('/user', userRouter)


app.listen(3000, (req,res)=>{
    console.log("server is running on port 3000")

})




