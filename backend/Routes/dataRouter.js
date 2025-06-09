const express = require('express');
const DataRouter = express.Router();
const ensureAuthenticated = require('../Middlewares/Authentication.js');
const { getStudentDatabyCriteria } = require('../Controllers/DataController.js');


DataRouter.get('/students', ensureAuthenticated(['Admin', 'HOD', 'Faculty']), getStudentDatabyCriteria)






module.exports = DataRouter;