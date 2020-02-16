const express = require("express")
const dotenv = require("dotenv")

dotenv.config({path:"./config/config.env"})

const app = express()
app.use(express.json())

const port = process.env.PORT;

app.listen(port, ()=>console.log(`Connected to port ${port} on ${process.env.NODE_ENV}`))

