const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

const collectionName = "plants"

async function query(filterBy = null) {
  console.log('plant.service - query', filterBy)
  try {
    const criteria = _buildCriteria(filterBy);
    const collection = await dbService.getCollection(collectionName);
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

async function remove(plantId) {
  try {
    const store = asyncLocalStorage.getStore()
    const { loggedinUser } = store
    const collection = await dbService.getCollection(collectionName)
    // remove only if plant is owner/admin
    const criteria = { _id: ObjectId(plantId) }
    if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
    const { deletedCount } = await collection.deleteOne(criteria)
    return deletedCount
  } catch (err) {
    logger.error(`cannot remove plant ${plantId}`, err)
    throw err
  }
}

async function add(plant) {
  console.log('plant.service - add')
  try {
    const plantToAdd = {
      byUserId: ObjectId(plant.byUserId),
      aboutUserId: ObjectId(plant.aboutUserId),
      txt: plant.txt
    }
    const collection = await dbService.getCollection(collectionName)
    await collection.insertOne(plantToAdd)
    return plantToAdd
  } catch (err) {
    logger.error('cannot insert plant', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {};
  // console.log('_buildCriteria filterBy', filterBy)

  if (filterBy.name) {
    criteria.name = { $regex: new RegExp(filterBy.name, 'i') };
  }

  if (filterBy.priceRange) {
    criteria.price = {
      $gte: filterBy.priceRange.min,
      $lte: filterBy.priceRange.max,
    };
  }

  if (filterBy.watering) {
    criteria.watering = filterBy.watering;
  }

  if (filterBy.lightning) {
    criteria.lightning = filterBy.lightning;
  }

  if (filterBy.difficulty) {
    criteria.difficulty = filterBy.difficulty;
  }

  if (filterBy.locations) {
    const selectedLocations = Object.keys(filterBy.locations).filter(
      (location) => filterBy.locations[location]
    );
    criteria.location = { $in: selectedLocations };
  }
 // console.log('_buildCriteria criteria', criteria)
  return criteria;
}

async function getPlantById(plantId) {
  const criteria = { _id: new ObjectId(plantId) };
  try {
    const collection = await dbService.getCollection(collectionName);
    const plant = await collection.findOne(criteria);
    return plant;
  } catch (err) {
    console.error('plantService - getPlantById - Error:', err);
    throw err;
  }
}

module.exports = {
  query,
  remove,
  add,
  getPlantById,
}