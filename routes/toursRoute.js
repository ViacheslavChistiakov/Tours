const express = require('express');
const toursControllers = require('../controllers/toursControllers');
const authController = require('../controllers/authController');

const router = express.Router();
router
  .route('/top-5-cheap')
  .get(toursControllers.alies, toursControllers.getAllTours);

router.route('/get-stats').get(toursControllers.getTourStats);
router.route('/monthly-plan/:year').get(toursControllers.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, toursControllers.getAllTours)
  .post(toursControllers.createTour);
router
  .route('/:id')
  .get(toursControllers.getTour)
  .patch(toursControllers.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursControllers.deleteTour
  );

module.exports = router;
