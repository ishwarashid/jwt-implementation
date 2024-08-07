const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const User = require("../model/User")

const handleAuth = async(req, res) => {

    const cookies = req.cookies

    console.log(`cookie available at login: ${JSON.stringify(cookies)}`);

    const username = req.body.username
    const password = req.body.password

    if(!username || !password) {
        return res.status(400).json({message: "Username and password are required!"})
    }
    
    const foundUser = await User.findOne({username: username}).exec()
    if(req.cookies) {
        const foundUser1 = await User.findOne({refreshToken: req.cookies.jwt}).exec()
        console.log(foundUser1)
    }

    console.log(foundUser)

    if(!foundUser){
        return res.sendStatus(401)
    }
    const result = await bcrypt.compare(password, foundUser.password)
    if(!result){
        return res.sendStatus(401)
    }
    // create jwt
    const roles = Object.values(foundUser.roles).filter(Boolean)
    const accessToken = jwt.sign(
        { 
            userInfo: {
                username: foundUser.username,
                roles: roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15s'}
    )
    const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d'}
    )

    let newRefreshTokenArray = !cookies?.jwt ? foundUser.refreshToken : foundUser.refreshToken.filter(token => token !== cookies.jwt)

    // check if cookies.jwt is in db or not, if it is, this means some attacker else used it to generate new access token

    if(cookies?.jwt) {
        const oldRefreshToken = cookies.jwt
        const foundToken = await User.findOne({refreshToken: oldRefreshToken}).exec()
        if(!foundToken){
            newRefreshTokenArray = []
        }

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    }

    newRefreshTokenArray = [...newRefreshTokenArray, newRefreshToken]

    foundUser.refreshToken = newRefreshTokenArray
    const response = await foundUser.save()
    console.log(response)

    res.cookie("jwt", newRefreshToken, { httpOnly: true, maxAge: 24*60*60*1000, sameSite: 'None'}) // add this after development secure: true
    
    res.json({roles, accessToken})

}

module.exports =  { handleAuth }