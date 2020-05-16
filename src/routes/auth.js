const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth');

router.get('/authorize', controller.authorize);
router.get('/authenticate', controller.authenticate);

module.exports = router;
