const bcrypt = require("bcrypt")
const saltRounds = 10;

const User = require("../model/User")

const handleNewUser = async(req, res) => {
    const { username, password } = req.body
    if(!username || !password) {
        return res.status(400).json({message: "Username and password are required!"})
    }
    const duplicate = await User.findOne({username: username}).exec()
    if(duplicate){
        return res.sendStatus(409)
    }
    try {
        const hash = await bcrypt.hash(password, saltRounds)
        // const newUser = new User({
        //     username: username,
        //     password: hash
        // })
        // const result = await newUser.save()

        const result = await User.create({
            username: username,
            password: hash
        })
        console.log(result)
        res.status(201).json({success: `New user ${username} created!`})

    } catch(err){
        console.log(err.stack)
        res.status(500).json({error: err.message})
    }   
}


module.exports = { handleNewUser }