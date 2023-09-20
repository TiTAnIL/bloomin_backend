const logger = require('../../services/logger.service')
const plantService = require('../plant/plant.service')
const authService = require('../auth/auth.service')
const socketService = require('../../services/socket.service')

async function getPlants(req, res) {
  logger.info('getPlants from controller with query params:', req.query)
  try {
    const plants = await plantService.query(req.query)
    res.send(plants)
  } catch (err) {
    logger.error('Cannot get plants', err)
    res.status(500).send({ err: 'Failed to get plants' })
  }
} 

async function addPlant(req, res) {
  console.log('addPlant')
  // var loggedinPlant = authService.validateToken(req.cookies.loginToken)

  try {
    var plant = req.body
    plant.byPlantId = loggedinPlant._id
    plant = await plantService.add(plant)

    plant.aboutPlant = await plantService.getById(plant.aboutPlantId)

    // var plant = await plantService.getById(plant.byPlantId)
    // plant.score += 10
    // loggedinPlant.score += 10

    loggedinPlant = await plantService.update(loggedinPlant)
    // plant.byPlant = loggedinPlant

    // Plant info is saved also in the login-token, update it
    const loginToken = authService.getLoginToken(loggedinPlant)
    res.cookie('loginToken', loginToken)

    delete plant.aboutPlantId
    delete plant.byPlantId

    // socketService.broadcast({type: 'plant-added', data: plant, plantId: loggedinPlant._id})
    // socketService.emitToPlant({type: 'plant-about-you', data: plant, plantId: plant.aboutPlantId})

    // const fullPlant = await plantService.getById(loggedinPlant._id)
    // socketService.emitTo({type: 'plant-updated', data: fullPlant, label: fullPlant._id})

    res.send(plant)

  } catch (err) {
    logger.error('Failed to add plant', err)
    res.status(500).send({ err: 'Failed to add plant' })
  }
}

async function updatePlant(req, res) {
  console.log('updatePlant')
  try {
      const plant = req.body
      const savedPlant = await plantService.update(plant)
      res.send(savedPlant)
  } catch (err) {
      logger.error('Failed to update plant', err)
      res.status(500).send({ err: 'Failed to update plant' })
  }
}

async function getPlantById(req, res) {
  const plantId = req.params.plantId
  try {
  const plant = await plantService.getPlantById(plantId)
  console.log(plant)
  res.send(plant)
  logger.info('getPlantById from controller with plantId:', plantId)
} catch (err) {
    logger.error('Failed to get plant', err)
    res.status(500).send({ err: 'Failed to get plant' })
  }
}

async function deletePlant(req, res) {
  console.log('deletePlant')
  try {
    const deletedCount = await plantService.remove(req.params.id)
    if (deletedCount === 1) {
      res.send({ msg: 'Deleted successfully' })
    } else {
      res.status(400).send({ err: 'Cannot remove plant' })
    }
  } catch (err) {
    logger.error('Failed to delete plant', err)
    res.status(500).send({ err: 'Failed to delete plant' })
  }
}

function getEmptyPlant() {
  console.log('getEmptyPlant')
  // Your getEmptyPlant logic here
}

async function getPlantsAsJson(req, res) {
  logger.info('getPlantsAsJson')
  try {
    const plants = await plantService.query(req.query)
    res.send(plants)
  } catch (err) {
    logger.error('Cannot get plants', err)
    res.status(500).send({ err: 'Failed to get plants' })
  }
}

async function getPlantByIdAsJson(req, res) {
  // console.log('getPlantByIdAsJson from controller with plantId:', req.params.plantId)
  const plantId = req.params.plantId
  try {
  const plant = await plantService.getPlantById(plantId)
  res.send(plant)
} catch (err) {
    logger.error('Failed to get plant AsJson', err)
    res.status(500).send({ err: 'Failed to get plant AsJson' })
  }
}


module.exports = {
  getPlants,
  deletePlant,
  addPlant,
  updatePlant,
  getPlantById,
  getPlantsAsJson,
  getPlantByIdAsJson
}