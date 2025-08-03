const express=require('express')
const app=express()
const dotenv=require('dotenv').config()
const mongoose=require('mongoose')
const session=require('express-session')
const MongoStore=require('connect-mongo')
const cors = require('cors');
app.use(cors({
    origin: '*'
}));


app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store:MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
  }))


app.use('/',require('./routes/assesment'))
app.use('/question',require('./routes/questions'))

port=process.env.PORT || 8000
const connectDB=require('./db')
connectDB()


app.listen(port,
    console.log(`server started on port ${port}`)
)
