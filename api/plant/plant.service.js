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
  console.log('remove plantId', plantId)
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
      watering: plant.watering,
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

// function _buildCriteria(filterBy) {
//   console.log(filterBy)
//   const criteria = {}
//   const keyMappings = {
//     'priceRange.min': 'price.$gte',
//     'priceRange.max': 'price.$lte',
//     'Home': 'location.$eq',
//     'Office': 'location.$eq',
//     'Garden': 'location.$eq',
//     'Balcony': 'location.$eq',
//     'Sunny': 'lightning',
//     'Shadow': 'lightning',
//     'Moderate': 'lightning',
//     'Easy': 'difficulty',
//     'Medium': 'difficulty',
//     'Hard': 'difficulty',
//     'Rarely': 'watering',
//     'Moderate': 'watering',
//     'Frequently': 'watering'
//   }
//   console.log('keyMappings', keyMappings)
//   for (const key in filterBy) {
//     const mappingKey = keyMappings[key];
//     if (mappingKey) {
//       const field = mappingKey.split('.')
//       if (!criteria[field[0]]) {
//         console.log('field[0]', field[0])
//         criteria[field[0]] = {}
//       }
//       criteria[field[0]][field[1]] = filterBy[key]
//     }
//   }
//   return criteria
// }

function _buildCriteria(filterBy) {
  const criteria = {};
  console.log('filterBy', filterBy)
  for (const key in filterBy) {
    console.log('key', key)
    if (key === 'priceRange.min' || key === 'priceRange.max') {
      if (!criteria.price) {
        criteria.price = {}
      }
      if (key === 'priceRange.min') {
        criteria.price.$gte = filterBy[key]
      }
      if (key === 'priceRange.max') {
        criteria.price.$lte = filterBy[key]
      }
    }
    if (key === 'Home') {
      criteria.location = {
        $eq: key
      }
      console.log('criteria.location', criteria.location)
    }
    if (key === 'Office') {
      criteria.location = {
        $eq: key
      }
      console.log('criteria.location', criteria.location)
    }
    if (key === 'Garden') {
      criteria.location = {
        $eq: key
      }
      console.log('criteria.location', criteria.location)
    }
    if (key === 'Balcony') {
      criteria.location = {
        $eq: key
      }
      console.log('criteria.location', criteria.location)
    }
    if (key === 'difficulty') {
      console.log('difficulty key', key, filterBy[key])
      criteria.difficulty = {
        $eq: filterBy[key]
      }
    }
    if (key === 'lightning') {
      console.log('lightning key', key, filterBy[key])
      criteria.lightning = {
        $eq: filterBy[key]
      }
    }
    if (key === 'watering') {
      console.log('watering key', key, filterBy[key])
      criteria.irrigation = {
        $eq: filterBy[key]
      }
    }

   

  

    // if (key === 'Sunny') {
    //   criteria.lightning = {
    //     $eq:
    //       lightning = key,
    //   }
    // }
    // if (key === 'Shadow') {
    //   criteria.lightning = {
    //     $eq:
    //       lightning = key,
    //   }
    // }
    // if (key === 'Moderate') {
    //   criteria.lightning = {
    //     $eq:
    //       lightning = key,
    //   }
    // }
    // if (key === 'Easy') {
    //   criteria.difficulty = {
    //     $eq:
    //       difficulty = key,
    //   }
    // }
    // if (key === 'Medium') {
    //   criteria.difficulty = {
    //     $eq:
    //       difficulty = key,
    //   }
    // }
    // if (key === 'Hard') {
    //   criteria.difficulty = {
    //     $eq:
    //       difficulty = key,
    //   }
    // }
    // if (key === 'Rarely') {
    //   criteria.watering = {
    //     $eq:
    //       watering = key,
    //   }
    // }
    // if (key === 'Moderate') {
    //   criteria.watering = {
    //     $eq:
    //       watering = key,
    //   }
    // }
    // if (key === 'Frequently') {
    //   criteria.watering = {
    //     $eq:
    //       watering = key,
    //   }
    // }

  }
  console.log('criteria', criteria)

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