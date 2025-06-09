const express = require('express');
const bodyParse = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();
const app = express()
const AuthRouter = require('./Routes/authRouter');
const DataRouter = require('./Routes/dataRouter');

const PORT = process.env.PORT || 5000


app.use(express.urlencoded({ extended: true }))
app.use(bodyParse.json())
app.use(cors())

app.use('/auth', AuthRouter)
app.use('/getData', DataRouter)


app.listen(PORT, () => {
    console.log(`server started at ${PORT}`)
})


const mongoUri = process.env.mongoUri
mongoose.connect(mongoUri)
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err));
