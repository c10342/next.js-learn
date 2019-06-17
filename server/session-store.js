function getKey(key){
    return `ssid:${key}`
}

class RedisSessionStroe{
    constructor(client){
        this.client = client
    }

    async get(key){
        const k = getKey(key)
        const data = await this.client.get(k)
        if(!data){
            return null
        }

        try {
            const result = JSON.parse(data)
            return result
        } catch (error) {
            console.error(error)
        }
    }

    async set(key,val,time){
        const k = getKey(key)

        if(typeof time == 'number'){
            time = Math.ceil(time/1000)  //传递进来的是毫秒，但是写进去的是秒
        }

        try {
            const data = JSON.stringify(val)
            if(time){
                await this.client.setex(k,time,data)
            }else{
                await this.client.set(k,data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    async destroy(key){
        const k = getKey(key)

        await this.client.del(k)
    }
}

module.exports = RedisSessionStroe