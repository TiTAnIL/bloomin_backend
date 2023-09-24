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
  console.log('remove plantId', plantId)
  try {
    // const store = asyncLocalStorage.getStore()
    // const { loggedinUser } = store
    const collection = await dbService.getCollection(collectionName)
    // remove only if plant is owner/admin
    const criteria = { _id: new ObjectId(plantId) }
    // if (!loggedinUser.isAdmin) criteria.byPlantId = ObjectId(loggedinUser._id)
    const { deletedCount } = await collection.deleteOne(criteria)
    return deletedCount
  } catch (err) {
    logger.error(`cannot remove plant ${plantId}`, err)
    throw err
  }
}

async function update(plant) {
  try {
    console.log(plant._id)
    console.log(typeof (plant._id), '\n')
    // peek only updatable properties
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
      irrigation: plant.irrigation,
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
    console.log('plant.service - add - plant:', plant)
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
      irrigation: plant.irrigation,
    }
    console.log('\n\n plant.service - add - plantToAdd:', plantToAdd, '\n\n')
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
  update,
  add,
  getPlantById,
}