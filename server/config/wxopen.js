module.exports = {
     appid: process.env.WX_OPEN_APPID || "appid",
     secret: process.env.WX_OPEN_SECRET || "secret",
     token: process.env.WX_OPEN_TOKEN || "token",
     encodingAESKey: process.env.WX_OPEN_ENCODINGAESKEY || "encoding_aes_key"
}
