const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addPlant, getPlants, deletePlant, getPlantById} = require('./plant.controller')
const router = express.Router()


// middleware that is specific to this router
// router.use(requireAuth)

router.get('/getPlants', log, getPlants);
router.get('/:plantId', log, getPlantById);
router.delete('/delete/:id', log, deletePlant);
router.post('/add', log, addPlant);
// router.get('/json', log, getPlantsAsJson);
// router.get('/json/:plantId', log, getPlantByIdAsJson);

module.exports = router