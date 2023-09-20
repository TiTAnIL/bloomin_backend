const MongoClient = require('mongodb').MongoClient

const config = require('../config')

module.exports = {
    getCollection
}

// Database Name
const dbName = 'bloomin'

var dbConn = null

async function getCollection(collectionName) {
    // console.log('getCollection')
    try {
        const db = await connect()
        const collection = await db.collection(collectionName)
        // console.log('collection returned', collection)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function connect() {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect("mongodb+srv://titan:titnt2020@cluster0.idvstym.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db(dbName)
        dbConn = db
        return db
    } catch (err) {
        console.log('mongoDB error: ',err)
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}


