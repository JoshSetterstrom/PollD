const {MongoClient} = require('mongodb')
const {api_token} = require('../config.json')

module.exports = {
    async updatePoll(guild, pollData) {
        let client = await MongoClient.connect(api_token)
        let col = client.db('polld-polls').collection(guild)
        col.findOneAndUpdate({id: pollData.id}, {"$set": pollData}, {upsert:true})
    },

    async getPoll(guild, id) {
        let client = await MongoClient.connect(api_token)
        let col = client.db('polld-polls').collection(guild)
        return await col.findOne({id: id})
    },

    async getAllPolls(guild) {
        results = []
        let client = await MongoClient.connect(api_token)
        let col = client.db('polld-polls').collection(guild)
        polls = col.find()
        await polls.forEach(poll => results.push(poll))
        return results
    },

    async removePoll(guild, id) {
        let client = await MongoClient.connect(api_token)
        let col = client.db('polld-polls').collection(guild)
        await col.deleteOne({id: id})
    }
}