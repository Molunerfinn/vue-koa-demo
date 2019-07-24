const wxopenConfig = require('../config/wxopen')
const Redis = require('ioredis');
const redis = new Redis();

const {
  ComponentAPI,
  API,
  Oauth
} = require('es-wechat-open-api');

var wxOpenOauth = {}

const componentAPI = new ComponentAPI({
  componentAppId: wxopenConfig.appid,
  componentAppSecret: wxopenConfig.secret,
  getComponentTicket: async () => {
    const ticket = await redis.get('componentTicket');
    return ticket;
  },
  getComponentToken: async () => {
    const ticket = await redis.get('componentToken');
    return ticket;
  },
  saveComponentToken: async componentToken => {
    await redis.set('componentToken', JSON.stringify(componentToken));
  }
})

function setOpenOauth(options) {
  console.log('options=====:',options);
  wxOpenOauth = new Oauth(options)
}

function getOpenOauth() {
  return wxOpenOauth;
}



module.exports = {
  componentAPI,
  setOpenOauth,
  getOpenOauth
};
