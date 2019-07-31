module.exports = {
     jwtSecret: process.env.JWT_SECRET || "secret",
     saltRounds: 8,
     sessionSecret: process.env.SESSION_SECRET ||'secret'
}
