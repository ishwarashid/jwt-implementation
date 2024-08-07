const express = require("express")
const path = require("path")
const cors = require("cors")
const mongoose = require("mongoose")

const { logger } = require("./middleware/logEvents")
const errorHandler = require("./middleware/errorHander")
const corsOptions = require("./config/corsOptions")
const app = express()
const verifyJWT = require("./middleware/verifyJWT")
const cookieParser = require("cookie-parser")
const credentials = require("./middleware/credentials")
const PORT = process.env.PORT || 3000
const connectDB = require("./config/dbConn")

connectDB()

app.use(logger)

app.use(credentials)

app.use(cors(corsOptions))

app.use("/", express.static(path.join(__dirname, "public")))
app.use("/subdir", express.static(path.join(__dirname, "public")))


app.use(express.urlencoded({extended: false}))

app.use(express.json())
app.use(cookieParser())


app.use("/subdir", require("./routes/subdirRoutes"))
app.use("/register", require("./routes/registerRoute"))
app.use("/auth", require("./routes/authRoute"))
app.use("/logout", require("./routes/logoutRoute"))
app.use("/refresh-token", require("./routes/refreshTokenRoute"))

app.use("/", require("./routes/rootRoutes"))

app.use("/employees", verifyJWT, require("./routes/api/employees"))


app.all('/*', (req, res) => {
    res.status(404)
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, "views", "404.html"))
    } else if(req.accepts('json')) {
        res.json({error: "404 Not Found"})
    } else {
        res.type("txt").send("404 Not Found")
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {

        console.log("Connected to MongoDB")
        app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))

    }
)