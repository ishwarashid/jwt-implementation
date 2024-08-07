const jwt = require('jsonwebtoken')
const User = require('../model/User')

const handleLogout = async(req, res) => {
    // clear out access token on client

    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)

    const refreshToken = cookies.jwt
    const foundUser = await User.findOne({refreshToken}).exec()
    if(!foundUser){
        res.clearCookie("jwt", {httpOnly: true, sameSite: 'None'}) // secure: true
        return res.sendStatus(204)
    }

    foundUser.refreshToken = foundUser.refreshToken.filter(token => token !== refreshToken)
    const response = await foundUser.save()
    console.log(response)
    
    res.clearCookie("jwt", {httpOnly: true, sameSite: 'None'}) // secure: true
    res.sendStatus(204)
    
}

module.exports =  { handleLogout }