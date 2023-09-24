const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addPlant, getPlants, updatePlant, deletePlant, getPlantById} = require('./plant.controller')
const router = express.Router()


// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getPlants);
router.get('/:plantId', log, getPlantById);
router.post('/', log, addPlant);
router.put('/:plantId', log, updatePlant);
router.delete('/:plantId', log, deletePlant);
// router.get('/json', log, getPlantsAsJson);
// router.get('/json/:plantId', log, getPlantByIdAsJson);

module.exports = router