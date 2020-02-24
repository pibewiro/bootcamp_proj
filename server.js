const express = require("express")
const dotenv = require("dotenv")
const database = require("./config/db")
const errorHandler = require("./middleware/error")
const fileUpload = require('express-fileupload')
const path = require("path")
const cookieParser = require("cookie-parser")


dotenv.config({
  path: "./config/config.env"
})

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
app.use("/api/v1/bootcamps", require("./routes/bootcamp"))
app.use("/api/v1/courses", require("./routes/course"))
app.use("/api/v1/users", require("./routes/user"))
app.use("/api/v1/auth", require("./routes/auth"))
app.use("/api/v1/reviews", require("./routes/review"))

app.use(errorHandler)
app.use(express.static(path.join(__dirname, 'public')))

const port = process.env.PORT;

database()

app.listen(port, () => console.log(`Connected to port ${port} on ${process.env.NODE_ENV}`))