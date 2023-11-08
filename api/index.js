const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const app = express()
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

mongoose
  .connect(
    'mongodb+srv://awaismumtaz0099:778677867786a..@cluster0.8uv8o4x.mongodb.net/linkedin',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log('MongoDB connected!'))

app.listen(4444, () => {
  console.log('Server is running on port 4444')
})

// mongodb+srv://awaismumtaz0099:778677867786a..@cluster0.8uv8o4x.mongodb.net/
