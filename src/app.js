// import express from 'express'
// import { config } from 'dotenv'
const express = require('express')
const { config } = require('dotenv')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
config()

const bookRoutes = require('./routes/book.route.js')

const app = express()

app.use(bodyparser.json())

// conectar bd mongoose

mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
const db = mongoose.connection

app.use('/books', bookRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`)
})
