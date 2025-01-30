//import dependencies
const cron = require('node-cron');
const sendRecommendations = require('../controllers/crmControllers/sendRecommendations');

//schedule a job
cron.schedule('0 12 * * 0', sendRecommendations);