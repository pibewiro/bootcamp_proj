const express = require("express")
const dotenv = require("dotenv")
const database = require("./config/db")
const errorHandler = require("./middleware/error")
dotenv.config({
  path: "./config/config.env"
})

const app = express()
app.use(express.json())
app.use("/api/v1/bootcamps", require("./routes/bootcamp"))
app.use("/api/v1/courses", require("./routes/course"))

app.use(errorHandler)

const port = process.env.PORT;

database()

app.listen(port, () => console.log(`Connected to port ${port} on ${process.env.NODE_ENV}`))