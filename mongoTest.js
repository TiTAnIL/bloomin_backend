const MongoClient = require('mongodb').MongoClient
const config = require('./config')
const dbName = 'bloomin'
var dbConn = null

async function connect() {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db(dbName)
        dbConn = db
        console.log('db connected', dbConn)
        return db
    } catch (err) {
        console.log('mongoDB error: ', err)
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}



async function getCollection(collectionName) {
    console.log('getCollection')
    try {
        const db = await connect()
        const collection = await db.collection(collectionName)
        console.log('collection', collection)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}



async function query(filterBy) {
    console.log('plant.service - query')
    try {
        const criteria = _buildCriteria(filterBy);
        const collection = await dbService.getCollection('plants');
        console.log('collection', collection)
        const aggregationPipeline = [
            { $match: criteria },
        ];
        const plants = await collection.aggregate(aggregationPipeline).toArray();
        return plants;
    } catch (err) {
        logger.error('Cannot find plants', err);
        throw err;
    }
}


async function close() {
    try {
        await dbConn.close()
    } catch (err) {
        logger.error('Cannot Close Connection', err)
        throw err
    }
}


async function mainTest() {
    console.log('main')
    try {
        const collection = await getCollection('plants')
        const plants = await collection.find().toArray()
        console.log('plants', plants)
    } catch (err) {
        console.log('error', err)
    } finally {
        close()
    }
}


module.exports = {
    mainTest
}
