const express = require('express');
const bodyParse = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();
const app = express()
const AuthRouter = require('./routes/authRouter')

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server started at ${PORT}`)
})

app.use(express.urlencoded({ extended: true }))
app.use(bodyParse.json())
app.use(cors())

app.use('/auth', AuthRouter)


const mongoUri = process.env.mongoUri
mongoose.connect(mongoUri)
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err));
