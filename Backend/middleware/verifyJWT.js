require('dotenv').config()
const jwt = require("jsonwebtoken")

const verifyJWT = (req, res, next) => {
    console.log("jwt")
    const authHeader = req.headers.authorization || req.headers.Authorization
    if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)
    console.log(authHeader)
    const token = authHeader.split(" ")[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.sendStatus(403) // forbidden
            req.user = decoded.userInfo.username
            req.roles = decoded.userInfo.roles
            next()
        }
    )
}

module.exports = verifyJWT