const { logEvents } = require("./logEvents")


const errorHandler = (err, req, res) => {
    console.log("jdhjgsd")
    console.log(err.stack)
    logEvents(`${err.name}\t${err.message}`, "errlog.txt")
    res.status(500).send(err.message)
}

module.exports = errorHandler