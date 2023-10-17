const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

const collectionName = "plants"

async function query(filterBy = null) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection(collectionName)
    const aggregationPipeline = [
      { $match: criteria },
    ];
    const plants = await collection.aggregate(aggregationPipeline).toArray()
    return plants
  } catch (err) {
    logger.error('Cannot find plants', err)
    throw err
  }
}

async function remove(plantId) {
  try {
    // const store = asyncLocalStorage.getStore()
    // const { loggedinUser } = store
    const collection = await dbService.getCollection(collectionName)
    // remove only if plant is owner/admin
    // if (!loggedinUser.isAdmin) criteria.byPlantId = ObjectId(loggedinUser._id)
    const criteria = { _id: new ObjectId(plantId) }
    const { deletedCount } = await collection.deleteOne(criteria)
    return deletedCount
  } catch (err) {
    logger.error(`cannot remove plant ${plantId}`, err)
    throw err
  }
}

async function update(plant) {
  try {
    const plantToSave = {
      _id: new ObjectId(plant._id),
      name: plant.name,
      about: plant.about,
      price: plant.price,
      height: plant.height,
      diameter: plant.diameter,
      pic: plant.pic,
      location: plant.location,
      difficulty: plant.difficulty,
      lightning: plant.lightning,
      watering: plant.watering,
    }
    const collection = await dbService.getCollection(collectionName)
    await collection.updateOne({ _id: plantToSave._id }, { $set: plantToSave })
    logger.info(`updated plant ${plantToSave._id}`)
    return plantToSave
  } catch (err) {
    logger.error(`cannot update plant ${plant._id}`, err)
    throw err
  }
}

async function add(plant) {
  try {
    const plantToAdd = {
      name: plant.name,
      about: plant.about,
      price: plant.price,
      height: plant.height,
      diameter: plant.diameter,
      pic: plant.pic,
      location: plant.location,
      difficulty: plant.difficulty,
      lightning: plant.lightning,
      watering: plant.watering,
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
  const filterMappings = {
    'name' : { key: 'name', operator: '$regex' },
    'priceRange.min': { key: 'price', operator: '$gte' },
    'priceRange.max': { key: 'price', operator: '$lte' },
    'Home': { key: 'location', operator: '$eq' },
    'Office': { key: 'location', operator: '$eq' },
    'Garden': { key: 'location', operator: '$eq' },
    'Balcony': { key: 'location', operator: '$eq' },
    'difficulty': { key: 'difficulty', operator: '$eq' },
    'lightning': { key: 'lightning', operator: '$eq' },
    'watering': { key: 'irrigation', operator: '$eq' }
  }

  for (const key in filterBy) {
    if (filterMappings[key]) {
      const { key: field, operator } = filterMappings[key]
      criteria[field] = criteria[field] || {}
      criteria[field][operator] = filterBy[key]
    }
  }
  return criteria;
}

async function getPlantById(plantId) {
  const criteria = { _id: new ObjectId(plantId) }
  try {
    const collection = await dbService.getCollection(collectionName)
    const plant = await collection.findOne(criteria)
    return plant
  } catch (err) {
    console.error('plantService - getPlantById - Error:', err)
    throw err;
  }
}

module.exports = {
  query,
  remove,
  update,
  add,
  getPlantById,
}