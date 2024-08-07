const mongoose = require("mongoose")
const Schema = mongoose.Schema

// const userSchema = new Schema({
//     username: {
//         type: String, 
//         required: true
//     },
//     roles: {
//         User: {
//             type: Number,
//             default: 2003
//         },
//         Admin: Number,
//         Editor: Number,
//     },
//     password: {
//         type: String, 
//         required: true
//     },
//     refreshToken: [String]
// })

const userSchema = new Schema({
    username: {
        type: String, 
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2003
        },
        Admin: Number,
        Editor: Number,
    },
    password: {
        type: String, 
        required: true
    },
    refreshToken: [String]
}, { versionKey: false })

module.exports = mongoose.model("User", userSchema)