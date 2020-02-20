const express = require("express")

const app = express()
app.use(express.json())
app.use("/api/v1/bootcamps", require("./routes/bootcamp"))
app.use("/api/v1/courses", require("./routes/course"))

module.exports = app;