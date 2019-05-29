const redis = require('redis')
const config = require('../config/dbConfig')

var redisClient = redis.createClient(config.redis.port, config.redis.host, config.redis.ops)
redisClient.on('ready', () => {
    console.log('', 'redis is ready');
})
redisClient.on('error', (error) => {
  console.log(error, 'connect redis fail: ' + error);
})
module.exports = class {
    constructor() {

    }
    mapToObj(map){
        const obj = {}
        for(let[key, value] of map)
        {
            obj[key] = value
        }
        return obj
    }
    set(key, value, next) {

        redisClient.set(key, JSON.stringify(this.mapToObj(value)), next)
    }

    objToMap(obj){
        var mapObj = new Map()
        for(var property in obj)
        {
            mapObj.set(parseInt(property), obj[property])
        }
        return mapObj
    }
    get(key, next) {
        redisClient.get(key, (error, rs)=>{
            if(error || !rs)
                next(error, rs)
            else{
                var mapObj = this.objToMap(JSON.parse(rs))
                next(error, mapObj)
            }
        })
    }

    has(key, next) {
        redisClient.exists(key, next)
    }

    remove(key, next) {
        redisClient.del(key, next)
    }

    update(key, value, next) {
        this.set(key, value, next)
    }

    hSet(key, field, obj, next) {
        var strValue = JSON.stringify(obj)
        redisClient.hset(key, field, strValue, next)
    }

    hExists(key, field, next) {
        redisClient.hexists(key, field, next)
    }

    hGetField(key, field, next) {
        redisClient.hget(key, field, (error, rs) => {
            if(error)
                next(error, rs)
            else{
                next(error, JSON.parse(rs))
            }
        })
    }

    hUpdateField(key, field, value, next) {
        this.hSet(key, field, value, next)
    }

    hRemoveField(key, field, next) {
        redisClient.hdel(key, field, next)
    }

    hGetAll(key, next) {
        redisClient.hgetall(key, next)
    }

    hLen(key, next) {
        redisClient.hlen(key, next)
    }
}
