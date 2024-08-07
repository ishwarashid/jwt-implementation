const allowedoOrigins = require("./allowedOrigins")

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedoOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

module.exports = corsOptions