const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const socketService = require('../../services/socket.service')
const plantService = require('./plant.service')

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
  var loggedinUser = authService.validateToken(req.cookies.loginToken)

  try {
    var plant = req.body
    plant.byUserId = loggedinUser._id
    plant = await plantService.add(plant)

    plant.aboutUser = await userService.getById(plant.aboutUserId)

    // var user = await userService.getById(plant.byUserId)
    // user.score += 10
    // loggedinUser.score += 10

    loggedinUser = await userService.update(loggedinUser)
    // plant.byUser = loggedinUser

    // User info is saved also in the login-token, update it
    const loginToken = authService.getLoginToken(loggedinUser)
    res.cookie('loginToken', loginToken)

    delete plant.aboutUserId
    delete plant.byUserId

    // socketService.broadcast({type: 'plant-added', data: plant, userId: loggedinUser._id})
    // socketService.emitToUser({type: 'plant-about-you', data: plant, userId: plant.aboutUserId})

    // const fullUser = await userService.getById(loggedinUser._id)
    // socketService.emitTo({type: 'user-updated', data: fullUser, label: fullUser._id})

    res.send(plant)

  } catch (err) {
    logger.error('Failed to add plant', err)
    res.status(500).send({ err: 'Failed to add plant' })
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
  getPlantById,
  // getEmptyPlant,
  getPlantsAsJson,
  getPlantByIdAsJson
}