const express = require('express');
const leadController = require("../controller/leadController");
const { isAuthenticated, isAdminOrManager } = require('../middleware/auth');

const router = express.Router();

router.post('/add', isAuthenticated, leadController.addLead);
router.put('/update/:leadId', isAuthenticated, leadController.updateLead);
router.get('/',leadController.getAllLeads);
router.post('/bulk', isAuthenticated,isAdminOrManager,leadController.addLeadsBulk);
router.get("/won",isAuthenticated,leadController.findwonleadofuser);
router.delete('/delete/:leadId', isAuthenticated,isAdminOrManager, leadController.deleteLead);


// Define other routes similarly

module.exports = router;
