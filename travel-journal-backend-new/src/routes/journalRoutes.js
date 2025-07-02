// src/routes/journalRoutes.js
const express = require('express');
const router = express.Router();
const { 
    createJournal, 
    getUserJournals, 
    getJournalById, 
    shareJournal,
    deleteJournal,
    getAllJournals
} = require('../controllers/journalController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const journalController = require('../controllers/journalController');
const authenticate = require('../middlewares/authMiddleware');

// Protected routes
router.post('/', authMiddleware, upload.array('images', 5), createJournal);
router.get('/user', authenticate, journalController.getUserJournals);
router.get('/all', authenticate, journalController.getAllJournals);
router.get('/:id', authenticate, journalController.getJournalById);
router.get('/share/:id', authMiddleware, shareJournal);
router.delete('/:id', authMiddleware, deleteJournal);
router.post('/:id/like', authMiddleware, require('../controllers/journalController').likeJournal);
router.post('/:id/comment', authMiddleware, require('../controllers/journalController').commentJournal);

module.exports = router;
